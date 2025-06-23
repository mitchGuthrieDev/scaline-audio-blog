// src/routes/episodes/[slug]/+page.ts
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { episodes } from '$lib/data';
import { marked } from 'marked';

export const load: PageLoad = async ({ params }) => {
  const episode = episodes.find((e) => e.slug === params.slug);
  if (!episode) throw error(404, 'Episode not found');

  // Extract numeric prefix: "03 - Deep Mix ..." → "03"
  const numericSlug = episode.slug.split(' - ')[0];

  // Preload all .md files as raw text
  const descriptionModules = import.meta.glob('/src/lib/descriptions/*.md', { as: 'raw' });

  // Build the key that matches exactly one of the imports
  const key = `/src/lib/descriptions/${numericSlug}.md`;

  // Load the markdown or fallback
  let md: string;
  if (descriptionModules[key]) {
    md = await descriptionModules[key]();
  } else {
    md = '_No description available._';
  }

  // Convert Markdown → HTML
  const descriptionHtml = marked.parse(md);

  return { episode, descriptionHtml };
};
