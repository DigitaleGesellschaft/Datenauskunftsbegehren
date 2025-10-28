<script>
  import { run } from 'svelte/legacy';
  import { _ } from 'svelte-i18n';

  import { data, userData } from '../stores.js';
  import VariableInput from '../VariableInput.svelte';
  import UserAddress from './UserAddress.svelte';
  import OrgSelection from './OrgSelection.svelte';

  let selectedEvent = $state()
  let variables = $state()

  run(() => {
    selectedEvent = $data.getEvent($userData.event)
    variables = selectedEvent ? selectedEvent.variables : []
  });
</script>
{#if selectedEvent}
  <h2>{$_("step_event.details_header", { default: "Mach noch einige Angaben für das Auskunftsbegehren aus speziellem Grund «{eventName}»", values: { eventName: selectedEvent.name } })}</h2>
  <div class="data-entry-form">
    {#if selectedEvent.handle !== 'rumor' && variables.length > 0}
    <section>
         <h3>{$_("details", { default: "Details" })}</h3>
        {#each variables as variable}
          <VariableInput {variable} bind:val="{$userData[variable.name]}"></VariableInput>
        {/each}
    </section>
    {/if}
    <section>
      <UserAddress></UserAddress>
    </section>
     <section>
      <h3>Organisation</h3>
      <label for="org">Wähle eine Organisation</label>
      <OrgSelection bind:org={$userData.org}></OrgSelection>
      <label for="orgAddress">oder gib die Adresse ein</label>
      <textarea id="orgAddress" bind:value={$userData.orgAddressEntry} rows="4"></textarea>
    </section>
  </div>
{/if}
