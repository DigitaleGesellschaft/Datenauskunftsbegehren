<script>
  import ShareIcon from './icons/ShareIcon.svelte'

  let hasShareApi = $derived(navigator.share)

  function share() {
    if (navigator.share) {
      try {
        navigator.share({
          title: "Datenauskunftsbegehren",
          text: "Dein Datenauskunftsbegehren:",
          url: window.location,
        })
      } catch (e) {
        console.log("Exception: " + e.toLocaleString());
      }
    }
  }
  
</script>

<div class="share">
  💡 Die Webadresse (URL) enthält all Deine Eingaben. Du kannst sie speichern
  {#if hasShareApi}
    oder Dir senden: <button class="circle" onclick={share}><ShareIcon></ShareIcon></button>
  {/if}.
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