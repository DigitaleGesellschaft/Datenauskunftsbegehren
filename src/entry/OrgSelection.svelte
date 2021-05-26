<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  import Select from 'svelte-select';
  import { data } from '../stores.js';

  export let org = undefined;
  export let options = undefined;

  let wrapper;
  let isTouch = false;
  
  $: orgOptions = (options ? options : $data.getCurrentlySelectableOrgs())
    .map(o => o.name);

  function handleSelect(event) {
    org = event.detail.value;
    dispatch('input', org);
  }

  function handleClear() {
    org = undefined;
    dispatch('input', org);
  }

  onMount(() => {
    wrapper.addEventListener('touchstart', () => {
      isTouch = true;
    }, {
      once: true
    })
  })

</script>

<div class="org-selection" bind:this={wrapper}>
  {#if !isTouch}
    <Select 
      selectedValue={org}
      bind:items={orgOptions}
      showIndicator="true"
      placeholder="Suche ..."
      noOptionsMessage="Keine Organisation gefunden"
      on:select={handleSelect}
      on:clear={handleClear}
    ></Select>
  {:else}
    <select value={org} on:input={(event) => handleSelect({detail: {value: event.target.value}})}>
      {#each orgOptions as org}
        <option value="{org}">{org}</option>
      {/each}
    </select>
  {/if}
</div>

<style>
  .org-selection {
    width: 100%;
    margin-bottom: 12px;

    --border: 2px solid var(--color-one);
    --borderFocusColor: var(--color-one);
    --borderHoverColor: var(--color-one);
    --borderRadius: 12px;

    --indicatorTop: 5px;
    --indicatorRight: 6px;
    --indicatorWidth: 16px;
    --indicatorHeight: 16px;

    --clearSelectTop: 5px;
    --clearSelectRight: 22px;
    --clearSelectWidth: 16px;
    --clearSelectHeight: 16px;

    --itemIsActiveBG: var(--color-one);
    --itemHoverBG: var(--color-ui-three);

    --inputColor: black;
    --placeholderColor: gray;

    --inputFontSize: 16px;
    --height: var(--input-height);
  }
</style>