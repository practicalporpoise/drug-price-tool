<script>
  export let items = []; // An array of strings
  export let id;
  export let name;
  export let placeholder;
  export let required;
  export let minChar = 2;
  export let maxItems = 10;

  export let value = '';
  export let inItems;

  let results = [];
  let highlightIdx = -1;

  $: inItems = items.includes(value);

  function search(value) {
    return items.filter(d => d.startsWith(value.toLowerCase())).slice(0, maxItems);
  }

  function onInput(event) {
    results = value.length >= minChar ? search(value) : '';
    if (highlightIdx < 0) highlightIdx = 0;
    else if (highlightIdx >= results.length) highlightIdx -= 1;
  }

  function select(result) {
    value = result;
    results = [];
  }

  function handleKeyDown(event) {
    // Don't handle keyboard events unless results are visible
    if (results.length === 0) return;

    switch (event.keyCode) {
      // Escape
      case 27: {
        event.preventDefault();
        results = [];
        break;
      }

      // ArrowDown
      case 40: {
        if (highlightIdx < results.length - 1) highlightIdx += 1;
        break;
      }

      // ArrowUp
      case 38: {
        if (highlightIdx >= 0) highlightIdx -= 1;
        break;
      }

      // Enter
      case 13: {
        event.preventDefault();
        select(results[highlightIdx]);
        break;
      }

      // Tab
      case 9: {
        results = [];
        break;
      }
    }
  }
</script>

<style>
  input {
    background-color: transparent;
    border-bottom: 2px solid black;
    font-size: large;
    margin-bottom: 0.5em;
    padding: 0.5em 1em;
    width: 100%;
  }
  ul {
    border: 1px solid lightgray;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    margin-top: calc(-0.5em - 1px);
  }
  li {
    color: #848484;
    cursor: pointer;
    letter-spacing: 0.025em;
    padding: 0.5em;
  }
  li:hover {
    background-color: #e8e8e8;
  }
  li.highlight {
    background-color: #e8e8e8;
  }
</style>

<div>
  <input
    type="text"
    {id}
    {name}
    {placeholder}
    {required}
    bind:value
    on:input={onInput}
    on:keydown={handleKeyDown} />
  {#if results.length > 0}
    <ul>
      {#each results as result, idx}
        <li class:highlight={idx === highlightIdx} on:click={() => select(result)}>
          <!-- This is a hack because the formatter stacks the elements leading to Svelte adding whitespace -->
          {@html `<span style="color: black;font-weight: bold;">${value}</span>${result.slice(value.length)}`}
        </li>
      {/each}
    </ul>
  {/if}
</div>
