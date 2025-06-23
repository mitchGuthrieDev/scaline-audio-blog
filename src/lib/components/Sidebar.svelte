<script lang="ts">
  import { episodes } from '$lib/data';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  const currentSlug = derived(page, $page => $page.params.slug || null);

  let currentIndex = -1;

  $: currentSlug.subscribe(slug => {
    currentIndex = episodes.findIndex(e => e.slug === slug);
  });

  $: prevEpisode = episodes[currentIndex - 1];
  $: nextEpisode = episodes[currentIndex + 1];
</script>

<pre class="terminal">
<span class="green">music for programming</span>
<span class="yellow">version 1.0.0</span>
---------------------
<span class="red loading">loading playlist</span>
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
</pre>
