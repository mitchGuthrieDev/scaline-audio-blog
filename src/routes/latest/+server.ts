// src/routes/latest/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { episodes } from '$lib/data';

export const GET: RequestHandler = () => {
  const last = episodes[episodes.length - 1];
  return new Response(null, {
    status: 307,
    headers: { Location: `/episodes/${last.slug}` }
  });
};
