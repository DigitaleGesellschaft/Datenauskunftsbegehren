<script>
  import ShareIcon from './icons/ShareIcon.svelte'

  $: hasShareApi = navigator.share

  function share() {
    if (navigator.share) {
      navigator.share({
        title: "Datenauskunftsbegehren",
        text: "Dein Datenauskunftsbegehren:",
        url: window.location,
      })
    }
  }
  
</script>

<div class="share">
  {#if hasShareApi}
    💡 Du kannst dir den Brief mit deinen Daten senden: <button class="circle" on:click={share}><ShareIcon></ShareIcon></button>
  {:else}
    💡 Du kannst die Webadresse (URL) speichern. Sie enthält alle deine Eingaben.
  {/if}
</div>

<style>
  .share {
    padding: 12px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    top: var(--header-height);
    background: rgba(255,255,255,0.5);
    border: 1px solid var(--color-ui-one);
    border-radius: 12px;

    margin: 8px;
    max-width: 800px;
  }

  .share button {
    margin-left: 12px;
    flex-shrink: 0;
  }

  @media print {
    .share {
      display: none;
    }
  }
</style>