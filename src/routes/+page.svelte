<script>
  import { episodes } from '$lib/data';
</script>

<h1>music for programming</h1>

<ul>
  {#each episodes as ep}
    <li>
      <a href={`/episodes/${ep.slug}`}>{ep.title}</a>
    </li>
  {/each}
</ul>
