<script>
  import {onMount} from 'svelte';
  import HideNodeAction from './HideNodeAction.svelte';
  import {data, orgAddressHtml, userAddressHtml, userData} from '../stores.js';
  import {nl2br} from '../lib.js';

  let letter2bNode
  let selectedOrg
  let selectedTypes
  let selectedEvent
  let customOpening
  let orgAddressTo
  let hidePrivacyStatementParagraphs = false

  $: {
    selectedOrg = $data.getOrg($userData.org)
    selectedTypes = $data.getTypes($userData.types || [])
    selectedEvent = $data.getEvent($userData.event)
    orgAddressTo = selectedOrg ? nl2br(selectedOrg.address) : ''
  }

  function setCaretToEndOf(node) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(node);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    node.focus();
    range.detach();
  }

  onMount(() => {
    if (!$userData.date || $userData.date === '' || $userData.date === '<br>') {
      userData.update(userData => {
        userData.date = Intl.DateTimeFormat('de-CH').format(Date.now())
        return userData;
      })
    }

    customOpening = $userData.customOpening ? $data.getCustomOpening($userData.customOpening) : undefined

    letter2bNode.addEventListener('keydown', event => {
      if (!event.target.contentEditable) return
      if (event.code === 'Backspace') {
        const length = event.target.innerText.replace(/[\n\r\s]+/, '').length;
        if (length === 0) {
          event.preventDefault();
          const prevSibling = event.target.previousElementSibling;
          event.target.remove()
          setCaretToEndOf(prevSibling)
        }
      }
      if (event.code === 'Enter') {
        if (['LI'].includes(event.target.nodeName)) {
          event.preventDefault();
          const newElement = event.target.cloneNode(false)
          event.target.insertAdjacentElement('afterend', newElement);
          setCaretToEndOf(newElement)
        }
      }
    })
  })
</script>
<div id="letter-container">
  <section id="letter" bind:this={letter2bNode}>
    <div class="letter-head">
      <div class="address-from">
        <span
          contenteditable
          spellcheck="false"
          class="editable-variable"
          data-label="Dein Name"
          class:empty={!$userData.name || $userData.name.length === 0}
          bind:innerHTML={$userData.name}>
        </span>
        <br>
        <span
          contenteditable
          spellcheck="false"
          class="editable-variable"
          data-label="Deine Adresse"
          class:empty={!$userAddressHtml || $userAddressHtml.length === 0}
          bind:innerHTML={$userAddressHtml}></span>
          
          <!-- chromium has a bug, and needs this empty span -->
          <span>&nbsp;</span>
      </div>

      <div class="address-to">
        <div contenteditable spellcheck="false">
          EINSCHREIBEN
        <HideNodeAction title="Ein-/ausblenden"></HideNodeAction>
        </div>
        <br>
        {#if orgAddressTo.length > 0}
          {@html orgAddressTo}
        {:else}
          <span
            contenteditable
            spellcheck="false"
            class="editable-variable"
            data-label="Empfängeradresse"
            class:empty={!$orgAddressHtml || $orgAddressHtml.length === 0}
            bind:innerHTML={$orgAddressHtml}>
          </span>
        {/if}
        <br><br><br>
      </div>
      <p
        class="date editable-variable"
        contenteditable
        spellcheck="false"
        data-label="Datum"
        class:empty={!$userData.date || $userData.date.length === 0}
        bind:innerHTML={$userData.date}>
      </p>
    </div>

    <h1 class="subject" contenteditable spellcheck="false">
      Datenauskunftsbegehren
    </h1>

    <p class="salutation" contenteditable spellcheck="false">
      Sehr geehrte Angesprochene
    </p>

    <p contenteditable spellcheck="false">
      Mit Datum vom TT. MMMM JJJJ habe ich bei Ihnen ein Datenauskunftsbegehren gestellt. Mit Ihrer Auskunft vom TT. MMMM JJJJ haben Sie dieses beantwortet.<br>
      Leider ist die Auskunft unvollständig.
    </p>
    <p contenteditable spellcheck="false">
    Es fehlen insbesondere folgende Daten:
    </p>
    <ul>
      <li contenteditable spellcheck="false">[Auflistung der fehlenden Daten]</li>
      <li contenteditable spellcheck="false">...</li>
    </ul>
    <p contenteditable spellcheck="false">
      Gemäss Art. 18 Abs. 2 der Verordnung zum Bundesgesetz über den Datenschutz vom 31. August 2022 (VDSG) muss eine Beschränkung der Auskunft in einem begründeten Entscheid erteilt werden. Ich bitte Sie, mir eine vollständige Auskunft nachzureichen oder gegebenenfalls die Beschränkung der Auskunft in einem Entscheid zu begründen.
    </p>
    <p contenteditable spellcheck="false">
      Darf ich Sie um entsprechende Bearbeitung bitten? Ich möchte Sie darauf hinweisen, dass bei einer vorsätzlich falschen oder unvollständigen Antwort eine Busse bis zu 250'000 Franken droht (Art. 60 DSG vom 25. September 2020).
    </p>

    <div class="no-break-inside">
      <p contenteditable spellcheck="false" class="no-break-after">
        Besten Dank und freundliche Grüsse
      </p>
      <br><br>
      <p
        contenteditable
        spellcheck="false"
        class="editable-variable"
        data-label="Dein Name"
        class:empty={!$userData.name || $userData.name.length === 0}
        bind:innerHTML={$userData.name}>
      </p>

    </div>
  </section>
</div>
<style>

#letter-container {
  width: 100%;
}
#letter {
  font-family: serif;
  background: white;
  flex-shrink: 0;
  font-size: 16px;
}

#letter h1 {
  font-size: 16px;
}

.letter-head {
  display: flex;
  flex-direction: column;
}

@media screen {
  #letter-container {
    margin-top: 20px;
  }
  #letter {
    margin: 0 auto;

    /* A4 */
    width: 210mm;
    min-height: 297mm;
    padding: 20mm;
  }
}

@media screen and (max-width: 220mm) {
  #letter-container {
    overflow-x: auto;
    height: 80vh;
    flex-shrink: 0;
  }
}

@media print {
  #letter {
    width: 100% !important;
    /* A4 */
    min-height: 297mm;
  }

  p, li {
    break-before: auto;
    page-break-inside: avoid;
  }

  .no-break-inside {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  p:empty {
    display: none;
  }
}

.address-to {
  margin-top: 7mm;
}
.date, .address-to {
  margin-left: 90mm;
}

h1 {
  font-weight: bold;
}

h1 {
  font-size: 18px;
  text-align: left;
}

</style>
