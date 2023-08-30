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
<div bind:this={node} on:click={removeNode}>
  <BinIcon></BinIcon>
</div>
<style>
  div {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: -3px;
    color: red;

    opacity: 0.3;
  }
  div:hover {
    opacity: 1;
  }

  @media print {
    div {
      display: none;
    }
  }
</style>