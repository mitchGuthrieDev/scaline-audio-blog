<script>
  import "../app.css";
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { episodes } from '$lib/data';
  import { page } from '$app/stores';
</script>

<div class="layout">
  <aside class="sidebar">
    <Sidebar />
  </aside>

  <main class="main-content">
    <slot />
  </main>

  <script lang="ts">
  import { page } from '$app/stores';
</script>

<aside class="episode-list">
  <ol>
    {#each episodes as ep, i}
      <li class={ep.slug === $page.params.slug ? 'current' : ''}>
        <a href={`/episodes/${ep.slug}`}>
          {i + 1}. {ep.title}
        </a>
      </li>
    {/each}
  </ol>
</aside>


</div>
