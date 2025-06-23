// src/lib/data.ts

export interface Episode {
  slug: string;
  title: string;
  description: string;
  audioUrl: string;
  length: string;
  date: string;
  // ...
}

export const episodes: Episode[] = [
  {
    slug: 'episode-1',
    title: 'The Beginning',
    description: '…',
    audioUrl: 'https://stream.scalineaudio.net/01%20-%20Antidance%20Theory%20%5BMetaprose%5D.mp3',
    length: '1:02:45',
    date: "2024-06-01T12:00:00Z"
  },
  {
    slug: 'episode-2',
    title: 'Further Explorations',
    description: '…',
    audioUrl: 'https://stream.scalineaudio.net/02%20-%20Pillars%20and%20Color%20%5BMetaprose%5D.mp3',
    length: '1:04:00',
    date: "2024-06-01T12:00:00Z"
  },
  // …and so on
];
