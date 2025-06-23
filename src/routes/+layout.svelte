<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import EpisodeList from '$lib/components/EpisodeList.svelte';
</script>

<div class="layout">
  <aside class="sidebar">
    <Sidebar />
  </aside>

  <main class="main-content">
    <slot />
  </main>

  <aside class="episode-list">
    <EpisodeList />
  </aside>
</div>
