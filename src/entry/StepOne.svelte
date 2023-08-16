<script>
  import { data, userData } from '../stores.js';
  import texts from '../texts.js';

  import OrgSelection from './OrgSelection.svelte';

  $: types = $data && $data.types ? $data.types : []
  $: events = $data && $data.events ? $data.events : []

</script>

<div class="step-one">
  <section>
    <h2>{texts.steps.one.org}</h2>
    <OrgSelection bind:org={$userData.org} on:input="{() => {$userData.entry = 'org'}}"></OrgSelection>
  </section>

  <div class="separator"><span>oder</span></div>

  <section>
    <h2>{texts.steps.one.type}</h2>
    {#each types as type}
      <button class="one" on:click="{() => {$userData.entry = 'type'; $userData.types = [type.handle]}}">{type.label}</button>
    {/each}
  </section>

  <div class="separator"><span>oder</span></div>
  
  <section>
    <h2>{texts.steps.one.event}</h2>
    {#each events as event}
      <button class="one" on:click="{() => {$userData.entry = 'event'; $userData.event = event.handle}}">{event.label}</button>
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