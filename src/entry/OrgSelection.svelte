<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  import Select from 'svelte-select';
  import { _ } from 'svelte-i18n';
  import { data } from '../stores.js';

  let { org = $bindable(undefined), options = undefined } = $props();

  let wrapper = $state();
  let isTouch = $state(false);
  
  let orgOptions = $derived((options ? options : $data.getCurrentlySelectableOrgs())
    .map(o => o.name));

  function handleSelect(selection) {
    org = selection?.value;
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
      value={org}
      items={orgOptions}
      placeholder={$_('org_selection.search_placeholder', { default: 'Suche ...' })}
      inputAttributes={{ 'data-qa': 'org-search-input' }}
      onselect={handleSelect}
      onclear={handleClear}
    >
      {#snippet item({ item: option })}
        <div data-qa="org-option">{option.label}</div>
      {/snippet}
      {#snippet empty()}
        <div class="empty">{$_('org_selection.no_options', { default: 'Keine Organisation gefunden' })}</div>
      {/snippet}
    </Select>
  {:else}
    <select data-qa="org-search-select" value={org} oninput={(event) => handleSelect({ value: event.target.value })}>
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
    --border-focused: 2px solid var(--color-one);
    --border-hover: 2px solid var(--color-one);
    --border-radius: 12px;

    --clear-select-width: 16px;
    --clear-select-height: 16px;
    --clear-select-margin: 0 6px 0 0;

    --item-is-active-bg: var(--color-one);
    --item-hover-bg: var(--color-ui-three);

    --input-color: black;
    --placeholder-color: gray;

    --font-size: 16px;
    --height: var(--input-height);
  }

  .empty {
    padding: 20px 0;
    text-align: center;
  }
</style>
