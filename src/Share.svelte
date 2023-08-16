<script>
  import ShareIcon from './icons/ShareIcon.svelte'

  $: hasShareApi = navigator.share

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
  <p class="share-top">💡 Du kannst Deine Eingaben und Briefe an die ausgewählte Organisation speichern:</p>
  <p class="share-elem">Die Webadresse (URL) in der Adressleiste Deines Browsers enthält Deine Briefe und Eingaben zur gewählten Organisation. Speichere die URL einfach in eine Datei, bspw. als Auskunft_X-AG_2023-09-07.url</p>
  {#if hasShareApi}
    <p class="share-elem">Mithilfe der Funktion <button class="share-elem" on:click={share}><ShareIcon></ShareIcon></button> "Teilen" Deines SmartDevice kannst deine Briefe und Eingaben an andere Programme auf Deinem Gerät senden.</p>
  {/if}
</div>

<style>
  .share {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 12px;

    top: var(--header-height);
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid var(--color-ui-one);
    border-radius: 12px;
    margin: 8px;
    max-width: 800px;
  }
  .share-top {
    grid-column: 1 / -1;
    grid-row:    1 / auto;
    text-align: center;
  }

  .share-elem, circle {
    grid-column: auto;
    grid-row: 2 / auto;
  }
  .share button, .share-elem button {
    padding: 0.13em;
    font-size: 80%;
    line-height: 1;
    display: inline-block;
  }

  @media print {
    .share {
      display: none;
    }
  }

  .share-orig {
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