<script>
  import Nav from "../components/Nav.svelte";

  export let segment;
</script>

<style>
  main {
    background-color: #fffcf9;
    height: calc(100vh - 57px);
  }
</style>

<Nav {segment} />

<main>
  <slot />
</main>
