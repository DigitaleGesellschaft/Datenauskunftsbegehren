<script>
  import { userData } from '../stores.js'

  let { paragraph } = $props();

  function handleEditableChange(event) {
    const srcElement = event.srcElement;
    if (srcElement.innerText.length === 0) {
      if (srcElement.parentNode.children.length === 1) {
        srcElement.parentNode.remove()
      } else {
        srcElement.remove()
      }
    }
  }
</script>
<p>
  {#each paragraph.tokens as token}
    {#if token.type === 'text'}
      <span contenteditable spellcheck="false" oninput={handleEditableChange}>{token.string}</span>
    {/if}
    {#if token.type === 'variable'}
      <span 
        id={token.variable.name}
        class="editable-variable"
        contenteditable
        spellcheck="false"
        data-label={token.variable.label}
        class:empty={!$userData[token.variable.name] || $userData[token.variable.name].length === 0}
        bind:innerHTML={$userData[token.variable.name]}
      ></span>
    {/if}
  {/each}
</p>

<style>
  
</style>