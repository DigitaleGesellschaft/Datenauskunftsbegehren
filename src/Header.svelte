<script>
  import Overlay from './Overlay.svelte';
  import Credits from './Credits.svelte';
  import Steps from './Steps.svelte'
  
  import InfoIcon from './icons/InfoIcon.svelte'
  export let activeStep;

  let showCredits = false
</script>

<header>
  <Steps on:step activeStep={activeStep}></Steps>
  <button class="credits circle one" on:click={() => showCredits = true}><InfoIcon width="30" height="30"></InfoIcon></button>
</header>
{#if showCredits}
  <Overlay on:close="{() => showCredits = false}">
    <Credits></Credits>
  </Overlay>
{/if}

<style>
  header {
    display: flex;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;

    width: 100%;
    height: var(--header-height);

    padding: 6px;
    border-bottom: 1px solid var(--color-ui-one);

    background: var(--color-ui-three);

    align-items: center;
    justify-content: space-between;
  }

  .credits {
    margin-left: auto
  }
</style>