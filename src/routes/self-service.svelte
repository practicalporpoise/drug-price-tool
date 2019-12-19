<script>
  import { fly } from 'svelte/transition';
  import OregonForm from '../forms/oregon/oregon-form';
  import { Form } from '../components';

  const TRANSITION_DURATION = 500;

  let formData = {};
  let errorMsg = '';
  let render = true;
  let currentNode = rootNode(OregonForm);
  let nodePath = [currentNode];

  const actions = { requestNext, requestPrevious, error };
  $: ctx = { actions, node: currentNode, nodePath };

  function requestNext() {
    if (!currentNode.next) {
      error({
        message: `Requested next for node that does not have a 'next' defined, current node: ${currentNode.key}`,
      });
      return;
    }

    const nextKey =
      typeof currentNode.next === 'function' ? currentNode.next(formData) : currentNode.next;
    const nextNode = getNode(OregonForm, nextKey);

    if (!nextNode) {
      error({
        message: `Could not find node for key: ${nextKey}, current node: ${currentNode.key}`,
      });
      return;
    }

    changeQuestion(() => {
      nodePath.push(nextNode);
      currentNode = nextNode;
    });
  }

  function requestPrevious() {
    if (nodePath.length < 2) {
      error({
        message: `Requested previous for node but there are no previous nodes, current nodepath: ${JSON.stringify(
          nodePath
        )}`,
      });
      return;
    }

    nodePath.pop();
    const nextNode = nodePath[nodePath.length - 1];

    changeQuestion(() => {
      currentNode = nextNode;
    });
  }

  function error(err) {
    errorMsg = err.message;
    console.error(errorMsg);
  }

  async function changeQuestion(fn) {
    render = false;
    await new Promise(resolve => setTimeout(resolve, TRANSITION_DURATION + 50));
    fn();
    render = true;
  }

  function rootNode(nodes) {
    const rootNodeKey = Object.keys(nodes).find(key => nodes[key].root);
    if (!rootNodeKey) {
      error({
        message: 'Could not find root node',
      });
      return null;
    }
    return getNode(nodes, rootNodeKey);
  }

  function getNode(nodes, key) {
    const node = nodes[key];
    if (!node) return null;
    return { ...node, key };
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

<svelte:head>
  <title>Self Service | Oregon Prescription Drug Price Transparency Tool</title>
</svelte:head>

<div class="container">
  {#if render}
    <div
      in:fly={{ y: -200, duration: TRANSITION_DURATION }}
      out:fly={{ y: 400, duration: TRANSITION_DURATION }}>

      {#if errorMsg}
        <h1 class="error">{errorMsg}</h1>
      {:else}
        <h1>{currentNode.heading}</h1>

        {#if currentNode.description}
          <p class="description">
            {@html currentNode.description}
          </p>
        {/if}

        <Form {ctx} {formData} />
      {/if}

    </div>
  {/if}
</div>
