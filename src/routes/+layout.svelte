<script>
  import "../app.css";
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { episodes } from '$lib/data';
</script>

<div class="layout">
  <aside class="sidebar">
    <Sidebar />
  </aside>

  <main class="main-content">
    <slot />
  </main>

  <aside class="episode-list">
    <ul>
 	 	{#each episodes as ep}
    		<li><a href={`/episodes/${ep.slug}`}>{ep.title}</a></li>
  		{/each}
	</ul>
  </aside>
</div>
