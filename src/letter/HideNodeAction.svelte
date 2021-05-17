<script>
  import { onMount, createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher();

  import EyeIcon from '../icons/EyeIcon.svelte'
  let node;

  export let title = "";
  export let setClass = true;

  function toggleNode() {
    if (setClass) {
      node.parentNode.classList.toggle('hide-for-print')
    }
    dispatch('toggle')
  }

  onMount(() => {
    if (node.parentNode.style.position === 'static' || node.parentNode.style.position === '') {
      node.parentNode.style.position = 'relative'
    }
  })
  
</script>
<div class="hide-node-action" bind:this={node} on:click={toggleNode} title="{title}">
  <EyeIcon></EyeIcon>
</div>
<style>
  div {
    cursor: pointer;
    position: absolute;
    left: -30px;
    top: 0;
    color: var(--color-one);

    opacity: 0.3;
  }
  div:hover {
    opacity: 1;
  }

  :global(li .hide-node-action) {
    left: -35px;
  }

  @media print {
    div {
      display: none;
    }
  }
</style>