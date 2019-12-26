<script>
  import { fly } from 'svelte/transition';

  export let duration;
  export let control;

  let render = true;

  $: onControl(control);

  async function onControl() {
    render = false;
    await new Promise(resolve => setTimeout(resolve, duration + 50));
    render = true;
  }
</script>

{#if render}
  <div in:fly={{ y: -200, duration }} out:fly={{ y: 400, duration }}>
    <slot />
  </div>
{/if}
