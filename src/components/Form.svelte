<script>
  import { FieldTypes } from '../lib/constants';
  import formulary from '../data/formulary';
  import Accordion from './Accordion.svelte';
  import AutoComplete from './Autocomplete.svelte';

  export let ctx = {};
  export let formData = {};

  const { actions, node, nodePath } = ctx;
</script>

<style>
  label.radio {
    border: 1px solid #9d9d9d;
    border-radius: 5px;
    cursor: pointer;
    display: block;
    font-size: large;
    margin-bottom: 0.5em;
    padding: 0.5em;
  }

  label.radio.selected {
    background-color: #e8e8e8;
  }

  input[type='radio'] {
    margin-right: 0.5em;
  }

  input[type='text'],
  input[type='email'],
  input[type='date'] {
    background-color: transparent;
    border-bottom: 2px solid black;
    font-size: large;
    margin-bottom: 0.5em;
    padding: 0.5em 1em;
    width: 100%;
  }

  button {
    border: 1px solid rgb(255, 62, 0);
    padding: 0.3em 0.7em;
    border-radius: 5px;
    top: 0.1em;
    position: relative;
    font-size: 1.5em;
  }

  button.outline {
    background-color: transparent;
    color: rgb(255, 62, 0);
  }

  button.primary {
    background: rgb(255, 62, 0);
    color: white;
  }

  button[disabled] {
    cursor: no-drop;
    opacity: 0.4;
  }

  .actions {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-top: 2em;
  }
  .sr-only {
    position: absolute;
    left: -999em;
  }

  .help-text {
    margin-top: 1em;
  }
</style>

<form on:submit|preventDefault={node.next ? actions.requestNext : () => {}}>
  {#if node.fields}
    {#each node.fields as field, idx}
      {#if field.type === FieldTypes.Radio}
        {#each field.options as { value, label }}
          <label class="radio" class:selected={value === formData[field.name]} for={value}>
            <input
              type="radio"
              id={value}
              name={field.name}
              bind:group={formData[field.name]}
              {value}
              required={!field.optional} />
            {label}
          </label>
        {/each}
      {:else}
        <label for={field.name} class:sr-only={!field.label}>{field.label || field.name}</label>
        {#if field.type === FieldTypes.Text}
          <input
            type="text"
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            bind:value={formData[field.name]}
            required={!field.optional} />
        {:else if field.type === FieldTypes.Email}
          <input
            type="email"
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            bind:value={formData[field.name]}
            required={!field.optional} />
        {:else if field.type === FieldTypes.Date}
          <input
            type="date"
            id={field.name}
            name={field.name}
            bind:value={formData[field.name]}
            required={!field.optional} />
        {:else if field.type === FieldTypes.Autocomplete}
          <AutoComplete
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            items={formulary}
            bind:value={formData[field.name]}
            bind:inItems={formData[`${field.name}InItems`]}
            required={!field.optional} />
        {/if}
      {/if}

      {#if field.helpText}
        <div class="help-text">
          <Accordion content={field.helpText} />
        </div>
      {/if}
    {/each}
  {/if}
  <div class="actions">
    {#if node.next}
      <button class="primary" type="submit">Next</button>
    {:else}
      <span />
    {/if}
    {#if nodePath.length > 1}
      <button class="outline" type="button" on:click|once={actions.requestPrevious}>Back</button>
    {/if}
  </div>
</form>
