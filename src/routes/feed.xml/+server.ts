// src/routes/feed.xml/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { episodes } from '$lib/data';

export const GET: RequestHandler = async () => {
  const items = episodes.map(e => `
    <item>
      <title>${e.title}</title>
      <link>https://your-domain.com/episodes/${e.slug}</link>
      <guid>https://your-domain.com/episodes/${e.slug}</guid>
      <pubDate>${new Date(e.date).toUTCString()}</pubDate>
      <enclosure url="https://your-domain.com${e.audioUrl}" length="${e.length}" type="audio/mpeg"/>
    </item>
  `).join('');

  const rss = `<?xml version="1.0"?>
<rss version="2.0">
<channel>
  <title>music for programming</title>
  <link>https://your-domain.com/</link>
  <description>...</description>
  ${items}
</channel>
</rss>`;

  return new Response(rss, {
    headers: { 'Content-Type': 'application/rss+xml' }
  });
};
