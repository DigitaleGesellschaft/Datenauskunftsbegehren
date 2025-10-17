<script>
  import { run } from 'svelte/legacy';

  import { data, userData } from '../stores.js';
  import VariableInput from '../VariableInput.svelte';
  import Checkbox from '../form/Checkbox.svelte';
  import UserAddress from './UserAddress.svelte';

  let selectedOrg = $state()
  let variables = $state()
  let variablesForTypeSelection = $state()

  run(() => {
    selectedOrg = $data.getOrg($userData.org)
    
    variables = selectedOrg ? selectedOrg.variables : []

    const types = $userData.types ? $userData.types : selectedOrg ? selectedOrg.types.map(type => type.handle).slice(0) : []

    // keep only types defined for the selected org if a org is selected
    $userData.types = types
      .filter(type => {
        if (!selectedOrg) return true
        return !!selectedOrg.types.find(orgType => type === orgType.handle)
      })

    // ignore variables source from a type not selected
    variablesForTypeSelection = variables
      .filter(variable => {
        if (!variable.source) return true
        if (variable.source !== 'type') return true
        if (variable.source === 'type' && $userData.types && $userData.types.includes(variable.sourceType)) return true
        return false
      })
      // make variables unique by name
      .reduce((variables, current) => {
        if (!variables.find(variable => variable.name === current.name)) {
          variables.push(current)
        }
        return variables
      }, [])
  });
</script>
{#if selectedOrg}
  <h2>Mach noch einige Angaben für das Auskunftsbegehren «{selectedOrg.name}»</h2>
  <div class="data-entry-form">
    {#if selectedOrg.types.length > 0}
      <section>
          <h3>Welche Dienste nutzt Du?</h3>
          {#each selectedOrg.types as type}
            <Checkbox label={type.serviceLabel} bind:group={$userData.types} value={type.handle}></Checkbox>
          {/each}
          <p class="small">
            (Für diese werden spezifisch Daten verlangt; kann auch weggelassen werden.)
          </p>
      </section>
    {/if}

    {#if variablesForTypeSelection.length > 0}
      <section>
        <h3>Deine Angaben</h3>
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