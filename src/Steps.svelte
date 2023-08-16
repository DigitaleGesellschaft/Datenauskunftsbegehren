<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import { userData } from './stores.js';

  export let activeStep;

</script>

<!--
  Wie können activeStep und dispatch variant umgesetzt werden?

  Etwa so?
    <StepLeDaInRequest>
    <StepLeDaInRemind>
    <StepLeDaInDemand>
    <StepLeDaInChange>
    <StepLeDaInDelete>
-->

<div class="steps">
  <button class="step" class:active={activeStep === 'entry' || !activeStep} on:click="{() => dispatch('step', 'entry')}">Eingabe</button>
  <!-- ➤ -->
  ❯
  {#if $userData.step === 'letter1' }
    <button class="step" class:active={activeStep === 'letter1'} on:click="{() => dispatch('step', 'letter1')}">Brief</button>
    ❯
  {:else if $userData.step === 'letter2a' }
    <button class="step" class:active={activeStep === 'letter2a'} on:click="{() => dispatch('step', 'letter2a')}">Brief</button>
    ❯
  {:else if $userData.step === 'letter2b' }
    <button class="step" class:active={activeStep === 'letter2b'} on:click="{() => dispatch('step', 'letter2b')}">Brief</button>
    ❯
  {:else if $userData.step === 'letter3a' }
    <button class="step" class:active={activeStep === 'letter3a'} on:click="{() => dispatch('step', 'letter3a')}">Brief</button>
    ❯
  {:else if $userData.step === 'letter3b' }
    <button class="step" class:active={activeStep === 'letter3b'} on:click="{() => dispatch('step', 'letter3b')}">Brief</button>
    ❯
  {/if}
  <button class="step" class:active={activeStep === 'print1'} on:click="{() => dispatch('step', 'print1')}">Drucken</button>
</div>
<style>
  .steps {
    color: var(--color-one);
    display: flex;
    align-items: center;
  }
</style>