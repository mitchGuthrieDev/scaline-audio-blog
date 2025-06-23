// src/routes/episodes/[slug]/+page.ts
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { episodes } from '$lib/data';

export const load: PageLoad = ({ params }) => {
  const episode = episodes.find((e) => e.slug === params.slug);

  if (!episode) {
    throw error(404, `Episode "${params.slug}" not found`);
  }

  return {
    episode
  };
};
