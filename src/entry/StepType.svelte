<script>
  import { data, userData } from '../stores.js';
  import VariableInput from '../VariableInput.svelte';
  import UserAddress from './UserAddress.svelte';
  import OrgSelection from './OrgSelection.svelte';

  $: selectedType = $data.getType($userData.types[0])
  $: variables = selectedType ? selectedType.variables : []
  $: orgsWithType = $data.orgs.filter(org => org.hasType(selectedType))

</script>

{#if selectedType}
  <h2>Mach noch einige Angaben für das Auskunftsbegehren «{selectedType.label}»</h2>
  <div class="data-entry-form">
    {#if variables.length > 0}
      <section>
        <h3>Deine Angaben</h3>
        {#each variables as variable}
          <VariableInput variable="{variable}" bind:val="{$userData[variable.name]}"></VariableInput>
        {/each}
      </section>
    {/if}
    <section>
      <UserAddress></UserAddress>
    </section>
    <section>
      <h3>Organisation</h3>
      <label for="org">Wähle eine Organisation</label>
      <OrgSelection bind:org={$userData.org} bind:options={orgsWithType}></OrgSelection>
      <label for="orgAddress">oder gib die Adresse ein</label>
      <textarea id="orgAddress" bind:value={$userData.orgAddressEntry} rows="4"></textarea>
    </section>
  </div>
{/if}