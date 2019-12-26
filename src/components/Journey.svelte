<script>
  import FormMachine from '../lib/form-machine';
  import FlyControl from './FlyControl.svelte';
  import Form from './Form.svelte';

  export let form;

  let machine;
  let ctx;
  let errorMsg = '';

  $: {
    machine = new FormMachine(form);
    ctx = machine.start();
  }

  const actions = { next, previous };
  function next() {
    changeQuestion(() => machine.next());
  }

  function previous() {
    changeQuestion(() => machine.previous());
  }

  function error(err) {
    errorMsg = err.message;
    console.error(errorMsg);
  }

  async function changeQuestion(next) {
    let _ctx;

    try {
      _ctx = next();
    } catch (err) {
      error(err);
      return;
    }
    ctx = _ctx;
  }
</script>

<style>
  h1 {
    font-weight: 300;
  }

  .error {
    color: red;
  }

  .container {
    margin: 0 auto;
    padding: 1em 1em;
    max-width: 45em;
  }

  p {
    margin-bottom: 2em;
  }

  .description {
    font-family: serif;
    font-size: larger;
  }

  @media (min-width: 480px) {
    .container {
      margin: 0 auto;
      padding: 6em 1em;
      max-width: 45em;
    }
  }
</style>

<div class="container">
  <FlyControl control={ctx.node} duration={500}>
    {#if errorMsg}
      <h1 class="error">{errorMsg}</h1>
    {:else}
      <h1>{ctx.node.heading}</h1>

      {#if ctx.node.description}
        <p class="description">
          {@html ctx.node.description}
        </p>
      {/if}

      <Form {ctx} {actions} />
    {/if}
  </FlyControl>
</div>
