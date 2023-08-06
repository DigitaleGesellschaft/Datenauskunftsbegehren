<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  import { userData } from '../stores.js';

  import StepOne from './StepOne.svelte';
  import StepOrg from './StepOrg.svelte';
  import StepType from './StepType.svelte';
  import StepEvent from './StepEvent.svelte';
</script>

<div class="container">
    {#if !$userData.org && !$userData.entry}
      <StepOne></StepOne>
    {/if}

    {#if $userData.org && $userData.entry === 'org'}
      <StepOrg></StepOrg>
    {/if}

    {#if $userData.entry === 'type' && ($userData.types && $userData.types.length === 1)}
      <StepType></StepType>
    {/if}

    {#if $userData.entry === 'event' && ($userData.event)}
      <StepEvent></StepEvent>
    {/if}
    <div class="actions">
      {#if $userData.entry}
        <button class="two" on:click="{() => dispatch('reset')}">Eingabe zurücksetzen</button>
      {/if}
      <button class="two solid" on:click="{() => dispatch('step', 'letter1')}">❯ Brief generieren</button>
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