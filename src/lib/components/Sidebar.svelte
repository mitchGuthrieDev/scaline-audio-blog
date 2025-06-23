<script lang="ts">
  import { episodes } from '$lib/data';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';
  import { onDestroy } from 'svelte';

  // Extract numeric prefix for sorting
  function numPrefix(slug: string) {
    return Number.parseInt(slug.split(' - ')[0], 10) || 0;
  }

  // Sorted episodes array
  const sorted = [...episodes].sort(
    (a, b) => numPrefix(a.slug) - numPrefix(b.slug)
  );

  // Current slug from URL
  const currentSlug = derived(page, $page => $page.params.slug || null);

  let currentIndex = -1;
  $: currentSlug.subscribe(slug => {
    currentIndex = sorted.findIndex(e => e.slug === slug);
  });

  // Prev / Next
  $: prevEpisode = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  $: nextEpisode = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  // loading dots animation
  let dots = '';
  const cycle = ['.', '..', '...'];
  let i = 0;
  const interval = setInterval(() => {
    dots = cycle[i++ % cycle.length];
  }, 500);
  onDestroy(() => clearInterval(interval));

  // theme & fullscreen toggles
  function toggleTheme() {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
  }
  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }
</script>

<pre class="terminal">
<span class="green">music for programming</span>
<span class="yellow">version 1.0.0</span>
---------------------
<span class="red">loading playlist{dots}</span>

{#if currentIndex >= 0}
now playing: <span class="green">{sorted[currentIndex].title}</span>
length: <span class="yellow">{sorted[currentIndex].length}</span>
{:else}
<span class="yellow">no episode selected</span>
{/if}

{#if prevEpisode}
  <a href={`/episodes/${prevEpisode.slug}`} class="link">[ prev ]</a>
{:else}
  <span class="link">[ prev ]</span>
{/if}
{#if nextEpisode}
  <a href={`/episodes/${nextEpisode.slug}`} class="link">[ next ]</a>
{:else}
  <span class="link">[ next ]</span>
{/if}

---------------------
<a href="/" class="link">[ home ]</a>
<a href="/feed.xml" class="link">[ rss ]</a>
<a href="/credits" class="link">[ credits ]</a>
<a href="https://musicforprogramming.bandcamp.com" class="link" target="_blank" rel="noopener">[ bandcamp ]</a>
<a href="https://epks.scalineaudio.net/metaprose-epk-2025.pdf" class="link" target="_blank" rel="noopener">[ epk | media kit ]</a>
<button class="link" on:click={toggleTheme}>[ invert ]</button>
<button class="link" on:click={toggleFullscreen}>[ fullscreen ]</button>
</pre>
