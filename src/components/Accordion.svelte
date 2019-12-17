<script>
  export let content;

  let hidden = true;
</script>

<style>
  div {
    border: 1px solid #53adf7;
    border-radius: 5px;
  }

  button {
    background-color: #53adf7;
    color: white;
    padding: 0.5em 1em;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  p {
    background-color: #f5fbff;
    padding: 1em;
  }

  .hidden {
    display: none;
  }
</style>

<div>
  <button type="button" on:click={() => (hidden = !hidden)}>
    <img src="info.svg" alt="info" />
    <span>{hidden ? '▼' : '▲'}</span>
  </button>
  <p class:hidden>{@html content}</p>
</div>
