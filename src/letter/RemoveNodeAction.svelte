<script>
  import {createEventDispatcher, onMount} from 'svelte'
  import BinIcon from '../icons/BinIcon.svelte'

  const dispatch = createEventDispatcher();

  let node

  function removeNode() {
    dispatch('removed');
    // the node might already be gone from the removed event handler
    if (node && node.parentNode) {
      node.parentNode.remove()
    }
  }

  onMount(() => {
    if (node.parentNode.style.position === 'static' || node.parentNode.style.position === '') {
      node.parentNode.style.position = 'relative'
    }
  })
  
</script>
<button class="circle" bind:this={node} on:click={removeNode}>
  <BinIcon width="32" height="32"></BinIcon>
</button>

<!--
<div class="circle" bind:this={node} on:click={removeNode}>
  <BinIcon width="32" height="32"></BinIcon>
</div>
-->
<style>

  button, div {
    position: absolute;
    right: -20px;
    top: -3px;
    color: red;
    opacity: 0.3;
  }
  button:hover, div:hover {
    opacity: 1;
  }

  div {
    cursor: pointer;
  }

  @media print {
    div, button {
      display: none;
    }
  }
</style>