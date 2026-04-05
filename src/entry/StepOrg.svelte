<script>
  import { untrack } from 'svelte';
  import { _ } from 'svelte-i18n';

  import { data, userData } from '../stores.js';
  import VariableInput from '../VariableInput.svelte';
  import Checkbox from '../form/Checkbox.svelte';
  import UserAddress from './UserAddress.svelte';

  let selectedOrg = $derived($data.getOrg($userData.org))
  let variables = $derived(selectedOrg ? selectedOrg.variables : [])

  $effect(() => {
    const org = selectedOrg
    const currentTypes = untrack(() => $userData.types)
    const types = currentTypes
      ? currentTypes
      : org ? org.types.map(type => type.handle).slice(0) : []

    // keep only types defined for the selected org if a org is selected
    $userData.types = types.filter(type => {
      if (!org) return true
      return !!org.types.find(orgType => type === orgType.handle)
    })
  })

  // ignore variables sourced from a type that is not selected, and deduplicate by name
  let variablesForTypeSelection = $derived(
    variables
      .filter(variable => {
        if (!variable.source) return true
        if (variable.source !== 'type') return true
        return $userData.types && $userData.types.includes(variable.sourceType)
      })
      .reduce((acc, current) => {
        if (!acc.find(variable => variable.name === current.name)) acc.push(current)
        return acc
      }, [])
  )
</script>
{#if selectedOrg}
  <h2>{$_("provide_more_details", { default: "Mach noch einige Angaben für das Auskunftsbegehren «{orgName}»", values: { orgName: selectedOrg.name } })}</h2>
  <div class="data-entry-form">
    {#if selectedOrg.types.length > 0}
      <section>
           <h3>{$_("which_services_do_you_use", { default: "Welche Dienste nutzt Du?" })}</h3>
          {#each selectedOrg.types as type}
            <Checkbox label={type.serviceLabel} bind:group={$userData.types} value={type.handle}></Checkbox>
          {/each}
           <p class="small">
             ({$_("form_services_type_info", { default: "Für diese werden spezifisch Daten verlangt; kann auch weggelassen werden." })})
           </p>
      </section>
    {/if}

    {#if variablesForTypeSelection.length > 0}
      <section>
         <h3>{$_("your_details", { default: "Deine Angaben" })}</h3>
        {#each variablesForTypeSelection as variable}
          <VariableInput {variable} bind:val="{$userData[variable.name]}"></VariableInput>
        {/each}
      </section> 
    {/if}
    <section>
      <UserAddress></UserAddress>
    </section>
  </div>
{/if}