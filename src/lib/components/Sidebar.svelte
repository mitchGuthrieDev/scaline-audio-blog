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
  <a href={`/episodes/${prevEpisode.slug}`} class="link green">[ prev ]</a>
{:else}
  <span class="link green">[ prev ]</span>
{/if}
{#if nextEpisode}
  <a href={`/episodes/${nextEpisode.slug}`} class="link green">[ next ]</a>
{:else}
  <span class="link green">[ next ]</span>
{/if}

---------------------
<!-- blue links -->
<a href="/"               class="link blue">[ about ]</a>
<a href="/credits"        class="link blue">[ credits ]</a>
<a href="/feed.xml"       class="link blue">[ rss.xml ]</a>

<!-- orange links -->
<a href="https://patreon.com/..."       class="link orange" target="_blank" rel="noopener">[ patreon ]</a>
<a href="https://podcasts.apple.com/..." class="link orange" target="_blank" rel="noopener">[ podcasts.apple ]</a>

<!-- magenta links -->
<a href="https://epks.scalineaudio.net/metaprose-epk-2025.pdf"
   class="link magenta"
   target="_blank"
   rel="noopener">[ epk | media kit ]</a>
<a href="/about" class="link magenta">[ about ]</a>

<!-- green buttons -->
<button class="link green" on:click={toggleTheme}>[ invert ]</button>
<button class="link green" on:click={toggleFullscreen}>[ fullscreen ]</button>
</pre>
