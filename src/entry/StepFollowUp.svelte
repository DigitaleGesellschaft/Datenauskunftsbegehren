<script>
  import { run } from 'svelte/legacy';
  import { _ } from 'svelte-i18n';

  import { data, userData } from '../stores.js';
  import UserAddress from './UserAddress.svelte';
  import OrgSelection from './OrgSelection.svelte';

  let selectedDesire = $state()
  let selectedOrg = $state()

  run(() => {
    selectedDesire = $data.getDesire($userData.desire)
    selectedOrg = $data.getOrg($userData.org)
  });
</script>

{#if selectedDesire}
   <h2>{$_("step_followup.instructions", { default: "Mach noch einige Angaben für das Auskunftsbegehren" })}<br> «{selectedDesire.label}»</h2>
   <div class="data-entry-form">
     <section>
       <UserAddress></UserAddress>
     </section>
     <section>
       <h3>{$_("organisation", { default: "Organisation" })}</h3>
       <label for="org">{$_("select_organisation", { default: "Wähle eine Organisation" })}</label>
       <OrgSelection bind:org={$userData.org}></OrgSelection>
       <label for="orgAddress">{$_("or_enter_address", { default: "oder gib die Adresse ein" })}</label>
       <textarea id="orgAddress" bind:value={$userData.orgAddressEntry} rows="4"></textarea>
     </section>
   </div>
{:else}
  <h2>{$_("error.something_went_wrong", { default: "Etwas hat nicht funktioniert: userData.step ist undef oder nicht in der Auswahl. userData.desire: " })} userData.desire: {$userData.desire}</h2>
{/if}