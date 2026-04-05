<script>
  import {createEventDispatcher, onMount} from 'svelte'
  import BinIcon from '../icons/BinIcon.svelte'

  const dispatch = createEventDispatcher();

  let node = $state()

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
<button type="button" bind:this={node} onclick={removeNode}>
  <BinIcon></BinIcon>
</button>
<style>
  button {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: -3px;
    color: red;
    opacity: 0.3;
    background: none;
    border: none;
    padding: 0;
  }
  button:hover {
    opacity: 1;
  }

  @media print {
    button {
      display: none;
    }
  }
</style>