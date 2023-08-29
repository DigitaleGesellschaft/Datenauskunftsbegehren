<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import { userData } from './stores.js';

  export let activeStep;

</script>

<div class="steps">
  <button class="step" class:active={activeStep === 'entry' || !activeStep} on:click="{() => dispatch('step', 'entry')}">Eingabe</button>
  <!-- ➤ -->
  ❯
  {#if activeStep && activeStep !== 'entry' && ( activeStep === 'data_info_request' || $userData.desire === 'data_info_request' ) }
    <button class="step" class:active={activeStep === 'data_info_request' } on:click="{() => dispatch('step', 'data_info_request')}">Brief Auskunft</button>
    ❯
  {:else if activeStep && activeStep !== 'entry' && $userData.desire === 'unanswered' }
    <button class="step" class:active={activeStep === 'unanswered'} on:click="{() => dispatch('step', 'unanswered')}">Brief Mahnung</button>
    ❯
  {:else if activeStep && activeStep !== 'entry' && $userData.desire === 'incomplete_answer' }
    <button class="step" class:active={activeStep === 'incomplete_answer'} on:click="{() => dispatch('step', 'incomplete_answer')}">Brief Einforderung</button>
    ❯
  {:else if activeStep && activeStep !== 'entry' && $userData.desire === 'data_correction' }
    <button class="step" class:active={activeStep === 'data_correction'} on:click="{() => dispatch('step', 'data_correction')}">Brief Korrektur</button>
    ❯
  {:else if activeStep && activeStep !== 'entry' && $userData.desire === 'data_deletion' }
    <button class="step" class:active={activeStep === 'data_deletion'} on:click="{() => dispatch('step', 'data_deletion')}">Brief Löschung</button>
    ❯
  {/if}
  {#if activeStep && activeStep !== 'entry' }
    <button class="step" class:active={activeStep === 'print'} on:click="{() => dispatch('step', 'print')}">Drucken</button>
  {/if}
</div>
<style>
  .steps {
    color: var(--color-one);
    display: flex;
    align-items: center;
  }
</style>