#!/usr/bin/env node
// scripts/generateEpisodes.cjs

const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { fetch } = require('undici');
const { parseBuffer } = require('music-metadata');
const { writeFile } = require('fs').promises;
const { resolve } = require('path');

// Ensure you have these env vars set (locally via .env or in Pages secrets):
// R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL

async function main() {
  // 1) configure an S3Client against your R2 bucket
  const client = new S3Client({
    endpoint:         process.env.R2_ENDPOINT,
    region:           'auto',
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    },
    forcePathStyle:   true
  });

  // 2) list the bucket’s objects
  const resp = await client.send(new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME
  }));
  const objects = resp.Contents || [];

  // 3) build up an episodes array
  const episodes = [];
  for (const obj of objects) {
    const key = obj.Key;
    if (!key.endsWith('.mp3')) continue;

    const filename = key;
    const slug     = filename.replace(/\.mp3$/, '');
    const title    = slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    const audioUrl = `${process.env.R2_PUBLIC_URL}/${encodeURIComponent(filename)}`;

    // fetch and buffer the file to read its duration
    const res = await fetch(audioUrl);
    if (!res.ok) {
      console.warn(`⚠️  could not fetch ${audioUrl}, skipping`);
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

  // 4) emit src/lib/data.ts
  const out = `// GENERATED — do not edit by hand\n\n`
    + `export interface Episode {\n`
    + `  slug: string;\n  title: string;\n  description: string;\n  audioUrl: string;\n  length: string;\n}\n\n`
    + `export const episodes: Episode[] = ${JSON.stringify(episodes, null, 2)};\n`;

  const dest = resolve(__dirname, '../src/lib/data.ts');
  await writeFile(dest, out, 'utf8');
  console.log(`✅ Wrote ${episodes.length} episodes to ${dest}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
