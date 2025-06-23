<script lang="ts">
  import { episodes } from '$lib/data';
  export let params;

  const episode = episodes.find(e => e.slug === params.slug);
</script>

<h2>{episode?.title}</h2>

<p>{episode?.description}</p>

<audio controls src={episode?.audioUrl}></audio>
