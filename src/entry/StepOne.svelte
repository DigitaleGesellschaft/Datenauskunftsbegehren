<script>
  import { data, userData } from '../stores.js';
  import { _ } from 'svelte-i18n';

  import OrgSelection from './OrgSelection.svelte';

  let types = $derived($data && $data.types ? $data.types : [])
  let events = $derived($data && $data.events ? $data.events : [])
  let desires = $derived($data && $data.desires ? $data.desires : [])
</script>

<div class="step-one">
  <section>
    <h2>{$_('steps_one.org', { default: 'Direkt ein Unternehmen oder eine Behörde auswählen' })}</h2>
    <OrgSelection bind:org={$userData.org} on:input="{() => {$userData.entry = 'org'}}"></OrgSelection>
  </section>

  <div class="separator"><span>{$_('or', { default: 'oder' })}</span></div>

  <section>
    <h2>{$_('steps_one.type', { default: 'Ein Unternehmen oder eine Behörde über den Geschäftsbereich auswählen' })}</h2>
    {#each types as type}
      <button class="one" onclick={() => {$userData.entry = 'type'; $userData.types = [type.handle]}}>{type.label}</button>
    {/each}
  </section>

  <div class="separator"><span>{$_('or', { default: 'oder' })}</span></div>

  <section>
    <h2>{$_('steps_one.event', { default: 'Ein Datenauskunftsbegehren aus einem speziellen Grund stellen' })}</h2>
    {#each events as event}
      <button class="one" onclick={() => {$userData.entry = 'event'; $userData.event = event.handle}}>{event.label}</button>
    {/each}
  </section>

  <div class="separator"><span>{$_('or', { default: 'oder' })}</span></div>

  <section>
    <h2>{$_('steps_one.followup', { default: 'Zu einem bereits gestellten Datenauskunftsbegehren nachfassen' })}</h2>
    {#each desires as desire}
      <button class="one" onclick={() => {$userData.entry = 'followup'; $userData.desire = desire.handle}}>{desire.label}</button>
    {/each}
  </section>
</div>

<style>

  section {
    padding: 0 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  section h2 {
    width: 100%;
    margin-top: 24px;
    margin-bottom: 12px;
  }

  button {
    width: auto;
  }

  .separator {
    position: relative;
    text-align: center;
    font-size: 12px;
    margin-top: 36px;
  }

  .separator span {
    background: var(--color-ui-three);
    position: relative;
    padding: 10px;
  }

  .separator::before {
    content: '';
    display: block;
    width: 80%;
    height: 1px;
    background: black;
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>