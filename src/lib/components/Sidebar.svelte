<script lang="ts">
  import { episodes } from '$lib/data';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';
  import { onDestroy } from 'svelte';

  // Track the current episode index
  const currentSlug = derived(page, $page => $page.params.slug || null);
  let currentIndex = -1;
  $: currentSlug.subscribe(slug => {
    currentIndex = episodes.findIndex(e => e.slug === slug);
  });

  // Compute prev/next episodes
  $: prevEpisode = episodes[currentIndex - 1] ?? null;
  $: nextEpisode = episodes[currentIndex + 1] ?? null;

  // Animated “loading...”
  let dots = '';
  const cycle = ['.', '..', '...'];
  let i = 0;
  const interval = setInterval(() => {
    dots = cycle[i++ % cycle.length];
  }, 500);
  onDestroy(() => clearInterval(interval));

  // Theme toggle
  function toggleTheme() {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
  }

  // Fullscreen toggle
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
now playing: <span class="green">{episodes[currentIndex].title}</span>
length: <span class="yellow">{episodes[currentIndex].length}</span>
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
<a href="/"                              class="link">[ home ]</a>
<a href="/feed.xml"                      class="link">[ rss ]</a>
<a href="/credits"                       class="link">[ credits ]</a>
<a href="https://musicforprogramming.bandcamp.com"
   class="link" target="_blank" rel="noopener">[ bandcamp ]</a>
<button class="link" on:click={toggleTheme}>[ invert ]</button>
<button class="link" on:click={toggleFullscreen}>[ fullscreen ]</button>
</pre>
