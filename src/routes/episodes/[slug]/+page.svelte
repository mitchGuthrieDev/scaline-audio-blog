<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let audioEl: HTMLAudioElement;
  let isPlaying = false;

  // pull out number + title
  const slugParts = data.episode.slug.split('-');
  // assuming slug is "episode-74-ncw"
  const epNum = slugParts[1];
  const epTitle = data.episode.title;

  function togglePlay() {
    if (!audioEl) return;
    if (isPlaying) {
      audioEl.pause();
    } else {
      audioEl.play();
    }
  }

  onMount(() => {
    audioEl?.addEventListener('play',  () => (isPlaying = true));
    audioEl?.addEventListener('pause', () => (isPlaying = false));
  });
</script>

<section class="player">
  <!-- Header -->
  <h2 class="title">
    Episode {epNum}:&nbsp;{epTitle}
  </h2>

  <!-- Controls row -->
  <div class="controls">
  <button class="control" on:click={togglePlay}>
    [{isPlaying ? 'pause' : 'play'}]
  </button>

  <span class="length">{data.episode.length}</span>

  <a href={data.episode.audioUrl}
     download
     class="control">
    [source]
  </a>
  <!-- new file-size text -->
  <span class="filesize">({data.episode.fileSize})</span>
</div>


  <!-- Hidden native audio element -->
  <audio bind:this={audioEl} src={data.episode.audioUrl} preload="metadata" />

  <!-- Description / Track list -->
  <div class="description">
    {@html data.descriptionHtml}
  </div>
</section>

<style>
  .player {
    font-family: 'Courier New', monospace;
    color: var(--fg);
    max-width: 700px;
    margin: 0 auto;
  }
  .title {
    margin: 0 0 1rem 0;
    font-size: 2.5rem;
    text-transform: lowercase;
    font-weight: normal;
  }
  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .control {
    background: none;
    border: none;
    color: var(--link);
    cursor: pointer;
    font-family: inherit;
    text-transform: lowercase;
  }
  .control:hover {
    color: var(--link-hover);
    text-decoration: underline;
  }
  .length {
    color: var(--fg);
    font-size: 1rem;
  }
  .description {
    border-top: 1px solid #333;
    padding-top: 1rem;
    white-space: pre-wrap;
  }
</style>
