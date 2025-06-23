<script lang="ts">
  import { page } from '$app/stores';
  import { episodes } from '$lib/data';

  function numPrefix(slug: string) {
    return Number.parseInt(slug.split(' - ')[0], 10) || 0;
  }

  const sortedEpisodes = [...episodes].sort(
    (a, b) => numPrefix(a.slug) - numPrefix(b.slug)
  );
</script>

<aside class="episode-list">
  <ul>
    {#each sortedEpisodes as ep, i}
      <li class={ep.slug === $page.params.slug ? 'current' : ''}>
        <a href={`/episodes/${ep.slug}`}>
          {i + 1}: {ep.title}
        </a>
      </li>
    {/each}
  </ul>
</aside>
