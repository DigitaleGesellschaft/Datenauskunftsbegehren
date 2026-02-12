<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import StepOne from './StepOne.svelte';
  import StepOrg from './StepOrg.svelte';
  import StepType from './StepType.svelte';
  import StepEvent from './StepEvent.svelte';
  import StepFollowUp from './StepFollowUp.svelte';

  import { userData } from '../stores.js';

  function selectLetterType() {
      let step = 'data_info_request';
      if ( $userData.entry === 'followup' ) {
          step = $userData.desire
      }
      dispatch('step', step);
  }

</script>

<div class="container">
    {#if ( !$userData.org && !$userData.entry )}
      <StepOne></StepOne>
    {/if}

    {#if $userData.org && $userData.entry === 'org'}
      <StepOrg></StepOrg>
    {/if}

    {#if $userData.entry === 'type' && ($userData.types && $userData.types.length === 1)}
      <StepType></StepType>
    {/if}

    {#if $userData.entry === 'event' && ($userData.events && $userData.events.length > 0)}
      <StepEvent></StepEvent>
    {/if}

    {#if $userData.entry === 'followup'}
        <StepFollowUp></StepFollowUp>
    {/if}

    <div class="actions">
        {#if $userData.entry}
            <button class="two" onclick={() => dispatch('reset')}>Eingaben zurücksetzen</button>
        {/if}
        <button class="two solid" onclick={selectLetterType}>❯ Brief generieren</button>
    </div>
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
  }

  .actions {
    width: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }

  button {
    margin-top: 36px;
  }

  button:only-child {
    margin-left: auto;
  }
</style>