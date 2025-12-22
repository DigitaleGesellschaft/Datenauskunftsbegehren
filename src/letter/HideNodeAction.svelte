<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import EyeIcon from '../icons/EyeIcon.svelte'

  const dispatch = createEventDispatcher();

  let node = $state();

  /**
   * @typedef {Object} Props
   * @property {string} [title]
   * @property {boolean} [setClass]
   */

  /** @type {Props} */
  let { title = "", setClass = true } = $props();

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
<div class="hide-node-action" bind:this={node} onclick={toggleNode} title="{title}">
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