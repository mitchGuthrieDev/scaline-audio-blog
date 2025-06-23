<script lang="ts">
  import { episodes } from '$lib/data';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';
  import { onDestroy } from 'svelte';

  // episode navigation
  const currentSlug = derived(page, $page => $page.params.slug || null);
  let currentIndex = -1;
  $: currentSlug.subscribe(slug => {
    currentIndex = episodes.findIndex(e => e.slug === slug);
  });
  $: prevEpisode = episodes[currentIndex - 1];
  $: nextEpisode = episodes[currentIndex + 1];

  // animated “loading...”
  let dots = '';
  const cycle = ['.', '..', '...'];
  let i = 0;
  const interval = setInterval(() => {
    dots = cycle[i++ % cycle.length];
  }, 500);
  onDestroy(() => clearInterval(interval));

  // theme toggle
  function toggleTheme() {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
  }

  // fullscreen toggle
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
<a href={`/episodes/${prevEpisode.slug}`}>[ prev ]</a>
{/if}
{#if nextEpisode}
<a href={`/episodes/${nextEpisode.slug}`}>[ next ]</a>
{/if}

---------------------
<a href="/" class="link">[ home ]</a>
<a href="/feed.xml" class="link">[ rss ]</a>
<a href="/credits" class="link">[ credits ]</a>
<a href="https://musicforprogramming.bandcamp.com" class="link" target="_blank" rel="noopener">[ bandcamp ]</a>
<button class="link" on:click={toggleTheme}>[ invert ]</button>
<button class="link" on:click={toggleFullscreen}>[ fullscreen ]</button>
</pre>
