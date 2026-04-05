<script>
  import Overlay from './Overlay.svelte';
  import Credits from './Credits.svelte';
  import LanguagePicker from './LanguagePicker.svelte';
  import Steps from './Steps.svelte'

  import InfoIcon from './icons/InfoIcon.svelte'
  import GlobeIcon from './icons/GlobeIcon.svelte'
  let { activeStep } = $props();

  let showCredits = $state(false)
  let showLanguagePicker = $state(false)
</script>

<header>
  <Steps on:step activeStep={activeStep}></Steps>
  <div class="actions">
    <button class="circle one" onclick={() => showLanguagePicker = true}><GlobeIcon width="30" height="30"></GlobeIcon></button>
    <button class="circle one" onclick={() => showCredits = true}><InfoIcon width="30" height="30"></InfoIcon></button>
  </div>
</header>
{#if showLanguagePicker}
  <Overlay on:close="{() => showLanguagePicker = false}">
    <LanguagePicker></LanguagePicker>
  </Overlay>
{/if}
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
    top: var(--banner-height);
    left: 0;

    width: 100%;
    height: var(--header-height);

    padding: 6px;
    border-bottom: 1px solid var(--color-ui-one);

    background: var(--color-ui-three);

    align-items: center;
    justify-content: space-between;
  }

  .actions {
    display: flex;
    gap: 4px;
    margin-left: auto;
  }
</style>