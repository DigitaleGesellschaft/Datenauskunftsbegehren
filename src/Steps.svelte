<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import { userData } from './stores.js';
  import { _ } from 'svelte-i18n';

  let { activeStep } = $props();

</script>

<div class="steps">
  <button class="step" class:active={activeStep === 'entry' || !activeStep} onclick={() => dispatch('step', 'entry')}>{$_('steps.labels.entry', { default: 'Eingabe' })}</button>
  <!-- ➤ -->
  ❯
  {#if activeStep && activeStep !== 'entry' && ( activeStep === 'data_info_request' || $userData.desire === 'data_info_request' )}
    <button class="step" class:active={activeStep === 'data_info_request' } onclick={() => dispatch('step', 'data_info_request')}>{$_('steps.labels.data_info_request', { default: 'Brief Auskunft' })}</button>
    ❯
  {:else if activeStep && activeStep !== 'entry' && $userData.desire === 'unanswered'}
    <button class="step" class:active={activeStep === 'unanswered'} onclick={() => dispatch('step', 'unanswered')}>{$_('steps.labels.unanswered', { default: 'Brief Mahnung' })}</button>
    ❯
  {:else if activeStep && activeStep !== 'entry' && $userData.desire === 'incomplete_answer'}
    <button class="step" class:active={activeStep === 'incomplete_answer'} onclick={() => dispatch('step', 'incomplete_answer')}>{$_('steps.labels.incomplete_answer', { default: 'Brief Einforderung' })}</button>
    ❯
  {:else if activeStep && activeStep !== 'entry' && $userData.desire === 'data_correction'}
    <button class="step" class:active={activeStep === 'data_correction'} onclick={() => dispatch('step', 'data_correction')}>{$_('steps.labels.data_correction', { default: 'Brief Korrektur' })}</button>
    ❯
  {:else if activeStep && activeStep !== 'entry' && $userData.desire === 'data_deletion'}
    <button class="step" class:active={activeStep === 'data_deletion'} onclick={() => dispatch('step', 'data_deletion')}>{$_('steps.labels.data_deletion', { default: 'Brief Löschung' })}</button>
    ❯
  {/if}
  {#if activeStep && activeStep !== 'entry'}
    <button class="step" class:active={activeStep === 'print'} onclick={() => dispatch('step', 'print')}>{$_('steps.labels.print', { default: 'Drucken' })}</button>
  {/if}
</div>
<style>
  .steps {
    color: var(--color-one);
    display: flex;
    align-items: center;
  }
</style>
