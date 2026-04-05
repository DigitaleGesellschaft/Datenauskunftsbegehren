<script>
  let {
    label,
    group = $bindable(),
    value
  } = $props();

  let id = `id-${Math.floor(Math.random() * 100000)}`

  let checked = $derived((group ?? []).indexOf(value) >= 0)

  function handleChange(event) {
    const isChecked = event.target.checked
    const index = (group ?? []).indexOf(value)
    if (isChecked) {
      if (index < 0) {
        group = [...(group ?? []), value]
      }
    } else {
      if (index >= 0) {
        group = (group ?? []).filter(v => v !== value)
      }
    }
  }
</script>
<label for="{id}" class="c-custom-checkbox">
  {#if value}
    <input type="checkbox" id="{id}" checked={checked} onchange={handleChange} value={value}>
  {:else}
    <input type="checkbox" id="{id}" checked={checked} onchange={handleChange}>
  {/if}
  
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path stroke-linecap="round" fill="none" d="M22.9 3.7l-15.2 16.6-6.6-7.1"></path>
  </svg>
  {label}
</label>

<style>
.c-custom-checkbox {
  display: block;
  position: relative;
  cursor: pointer;
  color: var(--color-one);
  
  display: flex;
}

.c-custom-checkbox svg { 
  display: inline-block;
  vertical-align: middle;
  margin-bottom: .2em;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  flex-shrink: 0;
  margin-right: 6px;
}


.c-custom-checkbox input[type="checkbox"] {
  cursor: pointer;
  opacity: 0.00001;
  width: 1em;
  height: 1em;
  position: absolute;
  left: 0;
  top: 0;
  flex-shrink: 0;
  /* accessibility wise this is not the best, therefore only for -moz because
  firefox on linux renderes the native checkbox otherwise. The opacity doesn't seem to work */
  -moz-appearance: none;
}

.c-custom-checkbox input[type="checkbox"] + svg {
  stroke: none;
  width: 20px;
  height: 20px;
}

.c-custom-checkbox input[type="checkbox"]:checked + svg {
  stroke: currentColor;
  stroke-width: 2px;
}

</style>