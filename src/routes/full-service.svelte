<script>
  import Journey from '../components/Journey.svelte';
  import OregonShortForm from '../forms/oregon/short-form';
</script>

<style>
  h1,
  figure,
  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  div {
    text-align: center;
  }

  img {
    margin: 0 auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Full Service | Oregon Prescription Drug Price Transparency Tool</title>
</svelte:head>

<Journey form={OregonShortForm} />
