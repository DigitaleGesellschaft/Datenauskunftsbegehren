<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import CloseIcon from './icons/CloseIcon.svelte';
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();

  onMount(() => {
    document.body.classList.add('with-overlay')
    window.scrollTo({
      top: 0
    });
    return () => {
      document.body.classList.remove('with-overlay')
      window.scrollTo({
        top: 0
      });
    }
  })
</script>
<div class="overlay">
  <header>
    <button class="one circle" onclick={() => dispatch('close')}><CloseIcon></CloseIcon></button>
  </header>
  <section>
    {@render children?.()}
  </section>
</div>
<style>
.overlay {
  position: relative;
  z-index: 2;
  width: 100%;
  background: white;
  padding-top: var(--header-height);
}

header {
  position: fixed;
  z-index: 2;
  top: 0;
  display: flex;
  height: var(--header-height);
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  padding: 6px;
  background: white;
}

section {
  position: relative;
  height: calc(100% - var(--header-height));
  padding: 12px;
}
</style>