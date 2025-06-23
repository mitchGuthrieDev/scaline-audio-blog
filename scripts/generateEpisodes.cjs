#!/usr/bin/env node
// scripts/generateEpisodes.cjs

const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { fetch } = require('undici');
const { parseBuffer } = require('music-metadata');
const { readFile, writeFile } = require('fs').promises;
const { resolve } = require('path');

// Paths
const MAPPING_FILE = resolve(__dirname, '../src/lib/episode-slugs.json');
const OUTPUT_FILE  = resolve(__dirname, '../src/lib/data.ts');

// 1) Load or initialize your slug‐mapping
async function loadMapping() {
  try {
    const text = await readFile(MAPPING_FILE, 'utf8');
    return JSON.parse(text);
  } catch {
    return {};  // no file yet
  }
}

// 2) Save back the updated mapping
async function saveMapping(mapping) {
  const text = JSON.stringify(mapping, null, 2) + '\n';
  await writeFile(MAPPING_FILE, text, 'utf8');
}

async function main() {
  // load your overrides
  const mapping = await loadMapping();

  // S3/R2 client
  const client = new S3Client({
    endpoint: process.env.R2_ENDPOINT,
    region: 'auto',
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
  });

  // list objects
  const resp = await client.send(new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME
  }));
  const objects = resp.Contents || [];

  const episodes = [];

  for (const obj of objects) {
    const key = obj.Key;
    if (!key?.endsWith('.mp3')) continue;

    const filename = key;
    // if it's new, seed the mapping with default basename
    if (!(filename in mapping)) {
      mapping[filename] = filename.replace(/\.mp3$/, '');
    }

    const slug = mapping[filename];               // YOUR custom slug
    const title = filename                          // human title (you can change as needed)
      .replace(/\.mp3$/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    const audioUrl = `${process.env.R2_PUBLIC_URL}/${encodeURIComponent(filename)}`;

    // fetch & parse duration
    const res = await fetch(audioUrl);
    if (!res.ok) {
      console.warn(`⚠️  skip ${filename}: fetch failed`);
      continue;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);
    const meta        = await parseBuffer(buffer, 'audio/mpeg', { duration: true });
    const totalSec    = Math.floor(meta.format.duration || 0);

    // format HH:MM:SS or MM:SS
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const parts = [];
    if (h) parts.push(String(h).padStart(2,'0'));
    parts.push(String(m).padStart(2,'0'));
    parts.push(String(s).padStart(2,'0'));
    const length = parts.join(':');

    episodes.push({ slug, title, description: '', audioUrl, length });
  }

  // persist any new mappings
  await saveMapping(mapping);

  // emit data.ts
  const out = `// GENERATED — do not edit by hand\n\n`
    + `export interface Episode {\n`
    + `  slug: string;\n  title: string;\n  description: string;\n  audioUrl: string;\n  length: string;\n}\n\n`
    + `export const episodes: Episode[] = ${JSON.stringify(episodes, null, 2)};\n`;

  await writeFile(OUTPUT_FILE, out, 'utf8');
  console.log(`✅ Wrote ${episodes.length} episodes to ${OUTPUT_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
