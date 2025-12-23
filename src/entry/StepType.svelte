<script>
  import { data, userData } from '../stores.js';
  import VariableInput from '../VariableInput.svelte';
  import UserAddress from './UserAddress.svelte';
  import OrgSelection from './OrgSelection.svelte';
  import { _ } from 'svelte-i18n';

  let selectedType = $derived($data.getType($userData.types[0]))
  let variables = $derived(selectedType ? selectedType.variables : [])
  let orgsWithType = $derived($data.getCurrentlySelectableOrgs().filter(org => org.hasType(selectedType)))

</script>

{#if selectedType}
  <h2>{$_("provide_more_details", { values: { orgName: selectedType.label } })}</h2>
  <div class="data-entry-form">
    {#if variables.length > 0}
      <section>
        <h3>{$_("your_details")}</h3>
        {#each variables as variable}
          <VariableInput {variable} bind:val="{$userData[variable.name]}"></VariableInput>
        {/each}
      </section>
    {/if}
    <section>
      <UserAddress></UserAddress>
    </section>
    <section>
      <h3>{$_("organisation")}</h3>
      <label for="org">{$_("select_organisation")}</label>
      <OrgSelection bind:org={$userData.org} bind:options={orgsWithType}></OrgSelection>
      <label for="orgAddress">{$_("or_enter_address")}</label>
      <textarea id="orgAddress" bind:value={$userData.orgAddressEntry} rows="4"></textarea>
    </section>
  </div>
{/if}