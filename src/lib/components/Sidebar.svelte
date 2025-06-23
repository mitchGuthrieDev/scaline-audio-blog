<script lang="ts">
  import { episodes } from '$lib/data';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';
  import { onDestroy } from 'svelte';

  // Pull out just the “XX” prefix from slugs like "03 - Deep Mix…"
  function numPrefix(slug: string) {
    return Number.parseInt(slug.split(' - ')[0], 10) || 0;
  }

  // A sorted copy of episodes by that numeric prefix
  const sorted = [...episodes].sort(
    (a, b) => numPrefix(a.slug) - numPrefix(b.slug)
  );

  // Track current slug from the URL
  const currentSlug = derived(page, $page => $page.params.slug || null);

  let currentIndex = -1;
  $: currentSlug.subscribe(slug => {
    currentIndex = sorted.findIndex(e => e.slug === slug);
  });

  // Prev/next based on sorted order
  $: prevEpisode = currentIndex > 0
    ? sorted[currentIndex - 1]
    : null;
  $: nextEpisode = currentIndex < sorted.length - 1
    ? sorted[currentIndex + 1]
    : null;

  // loading dots animation (unchanged)
  let dots = '';
  const cycle = ['.', '..', '...'];
  let i = 0;
  const interval = setInterval(() => {
    dots = cycle[i++ % cycle.length];
  }, 500);
  onDestroy(() => clearInterval(interval));

  // theme & fullscreen toggles (unchanged)
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
<!-- other nav links unchanged -->
</pre>
