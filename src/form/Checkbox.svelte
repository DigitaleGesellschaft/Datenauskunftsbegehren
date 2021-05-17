<script>
  export let label;
  export let checked;
  export let group;
  export let value;

  let id = `id-${Math.floor(Math.random() * 100000)}`

  $: updateCheckbox(group)
	$: updateGroup(checked)
	
	function updateCheckbox(group) {
		checked = group.indexOf(value) >= 0
	}
	
	function updateGroup(checked) {
		const index = group.indexOf(value)
		if (checked) {
			if (index < 0) {
				group.push(value)
				group = group
			}
		} else {
			if (index >= 0) {
				group.splice(index, 1)
				group = group
			}
		}
	}
</script>
<label for="{id}" class="c-custom-checkbox">
  {#if value}  
    <input type="checkbox" id="{id}" bind:checked={checked} value={value}>
  {:else}
    <input type="checkbox" id="{id}" bind:checked={checked}>
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