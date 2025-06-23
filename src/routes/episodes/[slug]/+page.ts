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

  // Try to load the matching markdown by number
  let md: string;
  try {
    md = await import(`$lib/descriptions/${numericSlug}.md?raw`);
  } catch {
    md = '_No description available._';
  }

  // Convert Markdown → HTML
  const descriptionHtml = marked.parse(md);

  return { episode, descriptionHtml };
};
