<script>
  import { fly } from 'svelte/transition';
  import OregonForm from '../lib/oregon-form';
  import { StepTypes } from '../lib/constants';
  import { Form } from '../components';

  let formData = {};
  let stepIdx = 0;
  let step = null;
  let message = '';

  let render = true;
  let component = null;

  $: handleStepChange(stepIdx);

  function handleStepChange(stepIdx) {
    console.log(`handling step: ${stepIdx}`, { formData });

    step = OregonForm.steps[stepIdx];
    if (!step) {
      message = `Hmmm, I can't find a step for index: ${stepIdx}.`;
    } else {
      switch (step.type) {
        case StepTypes.Fetch:
          step
            .fn()
            .then(actions.addData)
            .then(actions.next)
            .catch(actions.error);
          break;
        case StepTypes.Decision:
          const jumpStep = step.fn(formData);
          if (jumpStep) actions.jump(jumpStep);
          else actions.next();
          break;
        default:
          component = Form;
          break;
      }
    }
  }

  const actions = {
    addData(data) {
      formData = { ...formData, ...data };
    },
    end() {
      changeQuestion(() => {
        message = 'Thank you!!';
        step = null;
      });
    },
    next() {
      changeQuestion(() => (stepIdx += 1));
    },
    back() {
      changeQuestion(() => (stepIdx -= 1));
    },
    jump(key) {
      changeQuestion(() => (stepIdx = OregonForm.steps.findIndex(step => step.key === key)));
    },
    error(err) {
      message = `Hmmm, we seem to have a problem: ${err}`;
    },
  };

  async function changeQuestion(fn) {
    render = false;
    component = null;
    await new Promise(resolve => setTimeout(resolve, 550));
    fn();
    render = true;
  }
</script>

<style>
  h1 {
    font-weight: 300;
  }

  .container {
    margin: 0 auto;
    padding-top: 6em;
    width: 45em;
  }

  p {
    margin-bottom: 2em;
  }

  .description {
    font-family: serif;
    font-size: larger;
  }
</style>

<svelte:head>
  <title>Self Service | Oregon Prescription Drug Price Transparency Tool</title>
</svelte:head>

<div class="container">
  {#if render}
    <div transition:fly={{ y: 400, duration: 500 }}>
      {#if message || step.heading}
        <h1>{message || step.heading}</h1>
      {/if}

      {#if step}
        {#if step.description}
          <p class="description">
            {@html step.description}
          </p>
        {/if}

        {#if step.type === StepTypes.Form}
          <Form ctx={{ step, stepIdx, actions }} {formData} />
        {/if}
      {/if}
    </div>
  {/if}
</div>
