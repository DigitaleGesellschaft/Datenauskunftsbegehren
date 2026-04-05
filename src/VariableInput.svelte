<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import { lightFormat } from 'date-fns'

  let { variable, val = $bindable(undefined) } = $props();
  const uniqueId = Math.floor(Math.random() * 10000);
  const id = $derived(`id-${uniqueId}-${variable.name}`)

  function saveDate(event) {
    const date = event.target.value
    val = lightFormat(new Date(date), 'dd.MM.yyyy')
  }

  let inputFormattedDate = $derived.by(() => {
    let date
    if (val) {
      const dateTokens = val.split('.');
      const d = dateTokens[0];
      const m = parseInt(dateTokens[1]);
      const y = dateTokens[2];
      date = new Date(y, m - 1, d);
      if (isNaN(date)) {
        date = new Date()
      }
    } else {
      date = new Date()
    }
    return lightFormat(date, 'yyyy-MM-dd')
  })

</script>
{#if variable}
  <label for="{id}">{variable.label ? variable.label : variable.name}</label>

  {#if variable.type === 'tel'}
    <input id="{id}" type="tel" bind:value={val}>
  {/if}

  {#if variable.type === 'email'}
    <input id="{id}" type="email" bind:value={val}>
  {/if}

  {#if variable.type === 'date'}
    <input id="{id}" type="date" onchange={saveDate} value={inputFormattedDate}>
  {/if}

  {#if !variable.type || variable.type === 'string'}
    <input id="{id}" type="text" bind:value={val}>
  {/if}
{/if}