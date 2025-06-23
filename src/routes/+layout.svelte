<script>
  import "../app.css";
  import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<div class="page">
  <aside class="sidebar">
    <Sidebar />
  </aside>

  <main class="content">
    <slot />
  </main>
</div>
