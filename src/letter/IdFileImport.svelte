<script>

  import { tick, onMount, onDestroy } from 'svelte';
  import { debounce } from 'lodash-es';
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { idImages } from '../stores.js'

  import CheckIcon from '../icons/CheckIcon.svelte';
  import BinIcon from '../icons/BinIcon.svelte';
  import CloseIcon from '../icons/CloseIcon.svelte';
  import FolderIcon from '../icons/FolderIcon.svelte';

  export let side;

  let mode = 'grab';
  let width;
  let small = false
  let landscape = true
  let fileInput

  let imageElement;
  let imageObjectUrl;
  let container;
  let resizeObserver;

  const onFileSelected = (e) => {
    imageElement = e.target.files[0];
    imageObjectUrl = URL.createObjectURL(imageElement)  // check if really needed
    let reader = new FileReader();
    reader.readAsDataURL(imageElement);
    reader.onload = e => {
      const newIdImages = {
        ...$idImages
      }
      newIdImages[side] = e.target.result
      idImages.set(newIdImages)
    };
  }
  function acceptImage() {
    imageObjectUrl = undefined;
    console.log('acceptImage done')
  }

  function remove() {
    imageObjectUrl = undefined
    imageElement.setAttribute('src', '');
    const newIdImages = {
      ...$idImages
    }
    newIdImages[side] = undefined;
    idImages.set(newIdImages);
  }

  onMount(() => {
    const debouncedSetSizes = debounce(setSizes, 300, {leading: true, trailing: true});
    debouncedSetSizes();
    resizeObserver = new ResizeObserver(() => {
      console.log('resizeObserver debounces ...')
      debouncedSetSizes()
    });
    resizeObserver.observe(container);
    console.log('resizeObserver observes')
  })

  onDestroy(() => {
    resizeObserver.unobserve(container);
  })

  function setSizes() {
    console.log('setSizes width=' + width + ' small=' + small + ' landscape=' + landscape)
    width = container.getBoundingClientRect().width
    if (width < 600 && small === false) {
      small = true;
    } else if (width > 599 && small === true) {
      small = false;
    }
    const res = window.matchMedia('(orientation: landscape)')
    if (res.matches && landscape === false) {
      landscape = true;
    } else if (!res.matches && landscape === true) {
      landscape = false;
    }
    console.log('setSizes width=' + width + ' small=' + small + ' landscape=' + landscape)
  }

</script>

<div class="id-import" bind:this={container} class:small={small} class:landscape={landscape} class:grab={mode === 'grab'}>
  <!-- image import -->
  {#if mode === 'grab'}
    <div class="import-step">
      {#if small }
        <button class="one circle" on:click={() => mode = 'init'}>
          <CloseIcon></CloseIcon>
        </button>
      {/if}
      <div class="image">
          <!-- display selected image -->
          <div class="image-container" class:visible="{imageObjectUrl}">
            <img bind:this={imageElement} alt="ID">
          </div>
      </div>

      <div class="controls">
        <!-- no image selected and found -->
        {#if !imageObjectUrl}

          <!-- rather large area to click upon -->
          <!--
          <span style="cursor: pointer" on:click="{()=>{fileInput.click();}}">
          </span>
          -->
            <!-- button (to have the fancy circle around the FolderIcon -->
            <button class="one big-circle" on:click="{() => {fileInput.click();}}" disabled={false}>
              <!-- parametric svg icon -->
              <FolderIcon width="60" height="60"></FolderIcon>
              <!-- hidden input element to fetch the selected image (bound to "fileInput" to keep it separate from pre-existing "imageElement" -->
              <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change="{(e)=>onFileSelected(e)}" bind:this="{fileInput}" />
            </button>
            Ausweis {#if side === 'both'}beidseitig{:else if side === 'front'}Vorderseite{:else}Rückseite{/if}

        {:else}
          <button class="one big-circle" on:click="{() => remove()}"><BinIcon width="60" height="60"></BinIcon></button>
          <button class="one big-circle" on:click="{() => acceptImage()}"><CheckIcon width="60" height="60"></CheckIcon></button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>

.id-import {
  width: 100%;
  max-width: 70vw;
}

.import-step {
  font-family: 'Montserrat';
  font-size: 18px;
  width: 100%;
  padding: 4px;
  border: 4px solid var(--color-one);
  border-radius: 12px;
}

.import-step .image {
  width: 100%;
  max-width: 10cm;
  position: relative;
}

.import-step .controls {
  width: 100%;
  padding-left: 2px;
  display: grid;
  gap: 12px;
}

.import-step .controls p:first-child {
  margin-top: 0;
}

.image-container {
  width: 40%;
  padding-bottom: calc(720 / 1280 * 100%);
  position: relative;
}
.image-container img {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
}

:global(.image-container .cropper-container) {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
}

.image-container {
  display: none;
}
.image-container.visible {
  display: block;
}

.id-import.grab.small {
  position: fixed;
  top: var(--header-height);
  right: 0;
  bottom: 0;
  left: 0;
  max-width: 100vw;
  width: 100vw;
  height: calc(100vh - var(--header-height));
}

.small .import-step > button {
  position: absolute;
  top: 6px;
  right: 6px; 
}

.small .import-step {
  background: white;
  height: 100%;
  flex-direction: column;
}

.small .import-step .image {
  width: 40%;
  flex-shrink: 0;
  flex-grow: 1;
  margin-bottom: 3.6px;
}
.small .import-step .controls {
  width: 40%;
  flex-shrink: 0;
  margin: auto 0 20px 0;
}
.small .import-step .controls button:last-child {
  margin-left: auto;
}

.small .image-container {
  padding-bottom: 0;
  height: 100%;
}

.small .small .image-container img {
  display: block;
  width: 100%;
  height: 100%;
}

.small.landscape .import-step {
  flex-direction: row;
}

.small.landscape .import-step .image {
  width: 100%;
}

.small.landscape .import-step .controls {
  width: 100%;
}
@media print {
  .id-import {
    display: none;
  }
}

</style>