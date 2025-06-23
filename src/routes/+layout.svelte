<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import EpisodeList from '$lib/components/EpisodeList.svelte';
</script>

<div class="layout">
  <!-- Left column: your terminal‐style nav -->
  <aside class="sidebar">
    <Sidebar />
  </aside>

  <!-- Center column: page content (home or episode) -->
  <main class="main-content">
    <slot />
  </main>

  <!-- Right column: episode list -->
  <aside class="episode-list">
    <EpisodeList />
  </aside>
</div>
