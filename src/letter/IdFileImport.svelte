<script>

  import 'image-capture';

  import { tick, onMount, onDestroy } from 'svelte';
  import { debounce } from 'lodash-es';

  import { idImages } from '../stores.js'

  import CheckIcon from '../icons/CheckIcon.svelte';
  import BinIcon from '../icons/BinIcon.svelte';
  import CloseIcon from '../icons/CloseIcon.svelte';
  import FolderIcon from '../icons/FolderIcon.svelte';

  export let side;

  let mode = 'init';
  let width;
  let small = false
  let landscape = false

  let container;
  let videoElement;
  let imageElement;
  let imageObjectUrl;
  let cropper;
  let videoReady;

  let cropperModule;
  let resizeObserver;

  $: grabButtonText = !side || ( side === 'front' || side === 'both' ) ? 'hier beidseitiges Abbild oder Vorderseite des Ausweise auswählen ' : 'hier Abbild der Rückseite auswählen'

  async function getCropperModule() {
    if (!cropperModule) {
       const {default: Cropper} = await import('../../node_modules/cropperjs/dist/cropper.esm.js');
       cropperModule = Cropper;
    }
    return cropperModule;
  }

  async function grabMedia() {
    mode = 'ask';
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { 
        width: 1280,
        height: 720,
        facingMode: 'environment'
      }
    })
      .then(async (stream) => {
        mode = 'grab';
        await tick();
        videoElement.addEventListener('play', () => {
          videoReady = true;
        })
        videoElement.srcObject = stream;
        videoElement.load()
        videoElement.play();

        // load the cropper module already
        // we will most probably need it
        getCropperModule()
      })
      .catch(function(error) {
        console.error('error', error)
        mode = 'init'
      });
  }

  async function grabStill() {
    console.log('grabStill ...')
    console.log('grabStill end')
  }

  function applyCrop() {
    console.log('applyCrop ...')
    console.log('applyCrop end')
    const newImage = cropper.getCroppedCanvas().toDataURL('image/jpeg');
    cropper.destroy();
    cropper = undefined;
    imageElement.setAttribute('src', newImage);
    const newIdImages = {
      ...$idImages
    }
    newIdImages[side] = newImage
    idImages.set(newIdImages)
  }

  function remove() {
    imageObjectUrl = undefined
    imageElement.setAttribute('src', '');
    const newIdImages = {
      ...$idImages
    }
    newIdImages[side] = undefined;
    idImages.set(newIdImages);
    cropper.destroy();
    cropper = undefined;
    grabMedia();
  }

  onMount(() => {
    const debouncedSetSizes = debounce(setSizes, 300, {leading: true, trailing: true});
    debouncedSetSizes();
    resizeObserver = new ResizeObserver(() => {
      debouncedSetSizes()
    });
    resizeObserver.observe(container);
  })

  onDestroy(() => {
    resizeObserver.unobserve(container);
  })

  function setSizes() {
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
  }

</script>

<div class="id-capture" bind:this={container} class:small={small} class:landscape={landscape} class:grab={mode === 'grab'}>
  {#if mode === 'init'}
    <button class="init-id-capture-button one" on:click={grabMedia}>
      <FolderIcon></FolderIcon>
      <span>{grabButtonText}</span>
    </button>
  {/if}
  {#if mode === 'grab'}
    <div class="capture-step">
      {#if small}
        <button class="one circle" on:click={() => mode = 'init'}><CloseIcon></CloseIcon></button>
      {/if}
      <div class="image">
        {#if !imageObjectUrl}
          <div class="video-container">
            <video bind:this={videoElement} width=1280 height=720></video>
          </div>
        {/if}
        <div class="image-container" class:visible="{imageObjectUrl}">
          <img bind:this={imageElement} alt="ID">
        </div>
      </div>
      <div class="controls">
        {#if !imageObjectUrl}
          <div>
            <p>Halt deinen Ausweis vor die Kamera und drücke den Auslöser.</p>
            <p class="small">Du kannst das Bild danach zuschneiden.</p>
            <button class="one big-circle" on:click="{() => grabStill()}" disabled={!videoReady}>
              <FolderIcon width="60" height="60"></FolderIcon>
            </button>
          </div>
        {:else}
          <button class="one big-circle" on:click="{() => remove()}"><BinIcon width="60" height="60"></BinIcon></button>
          <button class="one big-circle" on:click="{() => applyCrop()}"><CheckIcon width="60" height="60"></CheckIcon></button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
.id-capture {
  width: 100%;
  max-width: 70vw;
}

.capture-step {
  font-family: 'Montserrat';
  font-size: 18px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 24px;
  border: 4px solid var(--color-one);
  border-radius: 12px;
}

.capture-step .image {
  width: 50%;
  position: relative;
}

.capture-step .controls {
  width: 50%;
  padding-left: 12px;
  display: flex;
  gap: 12px;
}

.capture-step .controls p:first-child {
  margin-top: 0;
}

.video-container, .image-container {
  width: 100%;
  padding-bottom: calc(720 / 1280 * 100%);
  position: relative;
}
.video-container video, .image-container img {
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

.id-capture.grab.small {
  position: fixed;
  top: var(--header-height);
  right: 0;
  bottom: 0;
  left: 0;
  max-width: 100vw;
  width: 100vw;
  height: calc(100vh - var(--header-height));
}

.small .capture-step > button {
  position: absolute;
  top: 6px;
  right: 6px; 
}

.small .capture-step {
  background: white;
  height: 100%;
  flex-direction: column;
}

.small .capture-step .image {
  width: 100%;
  flex-shrink: 0;
  flex-grow: 1;
  margin-bottom: 36px;
}
.small .capture-step .controls {
  width: 100%;
  flex-shrink: 0;
  margin: auto 0 20px 0;
}
.small .capture-step .controls button:last-child {
  margin-left: auto;
}

.small .video-container, .small .image-container {
  padding-bottom: 0;
  height: 100%;
}

.small .video-container video, .small .image-container img {
  display: block;
  width: 100%;
  height: 100%;
}

.small.landscape .capture-step {
  flex-direction: row;
}

.small.landscape .capture-step .image {
  width: 50%; 
}

.small.landscape .capture-step .controls {
  width: 50%; 
}
@media print {
  .id-capture {
    display: none;
  }
}

</style>