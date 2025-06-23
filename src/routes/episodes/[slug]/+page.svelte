<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<section class="player">
  <h2>
    episode {data.episode.slug.replace('episode-', '')}: {data.episode.title}
  </h2>

  <p class="description">{data.episode.description}</p>

  <audio
    controls
    src={data.episode.audioUrl}
    preload="metadata"
  ></audio>
</section>

<style>
  .player {
    font-family: 'Courier New', Courier, monospace;
    color: var(--fg);
    margin: 0 auto;
    max-width: 700px;
  }

  .player h2 {
    margin: 0 0 1rem 0;
    text-transform: lowercase;
    font-weight: normal;
  }

  .player .description {
    margin: 0 0 1rem 0;
    white-space: pre-wrap;
  }

  .player audio {
    width: 100%;
    max-width: 700px;
    margin-bottom: 2rem;
  }
</style>
