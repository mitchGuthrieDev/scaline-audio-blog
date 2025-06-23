// src/routes/episodes/[slug]/+page.ts
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { episodes } from '$lib/data';
import { marked } from 'marked';

export const load: PageLoad = async ({ params }) => {
  const episode = episodes.find(e => e.slug === params.slug);
  if (!episode) throw error(404, 'Not found');

  // import the Markdown as a raw string
  let md: string;
  try {
    md = await import(`$lib/descriptions/${params.slug}.md?raw`);
  } catch {
    md = '_No description available._';
  }

  // convert to HTML (you might sanitize this in prod)
  const descriptionHtml = marked.parse(md);

  return { episode, descriptionHtml };
};
