<script>
  import { episodes } from '$lib/data';
</script>

<h1>music for programming</h1>
<ul>
  {#each episodes as episode}
    <li>
      <a href={`/episodes/${episode.slug}`}>{episode.title}</a>
      <p>{episode.description}</p>
    </li>
  {/each}
</ul>
