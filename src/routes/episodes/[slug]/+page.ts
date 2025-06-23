// src/routes/episodes/[slug]/+page.ts
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { episodes } from '$lib/data';
import { marked } from 'marked';

export const load: PageLoad = async ({ params }) => {
  const episode = episodes.find((e) => e.slug === params.slug);
  if (!episode) throw error(404, 'Episode not found');

  const numericSlug = episode.slug.split(' - ')[0];

  // Grab all markdowns under descriptions as raw text
  const descriptionModules = import.meta.glob(
    '/src/lib/descriptions/*.md',
    { as: 'raw' }
  );

  // Debug: what files did we actually find?
  console.log('Available description files:', Object.keys(descriptionModules));

  // Find the one that ends with "/<numericSlug>.md"
  const matchingKey = Object.keys(descriptionModules)
    .find((path) => path.endsWith(`/${numericSlug}.md`));

  let md: string;
  if (matchingKey) {
    md = await descriptionModules[matchingKey]();
  } else {
    console.warn(`No description for numericSlug=${numericSlug}`);
    md = '_No description available._';
  }

  const descriptionHtml = marked.parse(md);

  return { episode, descriptionHtml };
};
