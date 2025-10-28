<script>
  import { run } from 'svelte/legacy';

  import { onMount } from 'svelte';
  import Paragraph from './Paragraph.svelte';
  import Bullets from './Bullets.svelte';
  import RemoveNodeAction from './RemoveNodeAction.svelte';
  import HideNodeAction from './HideNodeAction.svelte';
  import { _ } from 'svelte-i18n';

  import { data, userData, userAddressHtml, orgAddressHtml, idImages } from '../stores.js';
  import {nl2br} from '../lib.js';

  // Erstes Anschreiben
  // Auskunftsbegehren
  let letterDataInfoReqNode = $state()
  let selectedOrg = $state()
  let selectedTypes = $state()
  let selectedEvent = $state()
  let customOpening = $state()
  let orgAddressTo = $state()
  let hidePrivacyStatementParagraphs = $state(false)

  run(() => {
    selectedOrg = $data.getOrg($userData.org)
    selectedTypes = $data.getTypes($userData.types || [])
    selectedEvent = $data.getEvent($userData.event)
    orgAddressTo = selectedOrg ? nl2br(selectedOrg.address) : ''
  });

  let imageRemoved = { both: false, front: false, back: false}
  function removeIdImage(side) {
    imageRemoved[side] = true
    const newIdImages = {
      // see js spreed syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
      ...$idImages
    }
    delete newIdImages[side]
    idImages.set(newIdImages)
  }

  function handleBulletHiddenChange(event) {
    hidePrivacyStatementParagraphs = event.detail === 'all';
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

    letterDataInfoReqNode.addEventListener('keydown', event => {
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
  <section id="letter" bind:this={letterDataInfoReqNode}>
    <div class="letter-head">
      <div class="address-from">
         <span
           contenteditable
           spellcheck="false"
           class="editable-variable"
           data-label={$_("your_name", {default: "Dein Name"})}
           class:empty={!$userData.name || $userData.name.length === 0}
           bind:innerHTML={$userData.name}>
         </span>
        <br>
         <span
           contenteditable
           spellcheck="false"
           class="editable-variable"
           data-label={$_("your_address", {default: "Deine Adresse"})}
           class:empty={!$userAddressHtml || $userAddressHtml.length === 0}
           bind:innerHTML={$userAddressHtml}></span>
          
          <!-- chromium has a bug, and needs this empty span -->
          <span>&nbsp;</span>
      </div>

      <div class="address-to">
       <div contenteditable spellcheck="false">
           {$_("registered_mail", {default: "EINSCHREIBEN"})}
         <HideNodeAction title={$_("toggle_visibility", {default: "Ein-/ausblenden"})}></HideNodeAction>
         </div>
        <br>
        {#if orgAddressTo.length > 0}
          {@html orgAddressTo}
        {:else}
           <span
             contenteditable
             spellcheck="false"
             class="editable-variable"
             data-label={$_("recipient_address", {default: "Empfängeradresse"})}
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
         data-label={$_("date", {default: "Datum"})}
         class:empty={!$userData.date || $userData.date.length === 0}
         bind:innerHTML={$userData.date}>
       </p>
    </div>

    <h1 class="subject" contenteditable spellcheck="false">
      {$_("data_info_request", {default: "Datenauskunftsbegehren"})}
    </h1>

    <p class="salutation" contenteditable spellcheck="false">
      {$_("salutation", {default: "Sehr geehrte Angesprochene"})}
    </p>

    {#if selectedEvent}
      {#await selectedEvent then event}
        {#each event.paragraphs as paragraph}
          <Paragraph paragraph={paragraph}></Paragraph>
        {/each}
      {/await}
    {/if}

    {#if customOpening}
      {#await customOpening then paragraph}
        <Paragraph paragraph={paragraph}></Paragraph>
      {/await}
    {/if}

    <p contenteditable spellcheck="false">
      {$_("letter.initial_request", {default: "Ich ersuche Sie mit Verweis auf Art. 25 des Bundesgesetzes über den Datenschutz (DSG) vom 25.&nbsp;September 2020, mir innerhalb von 30 Tagen mitzuteilen, ob Daten über mich bearbeitet werden."})}
    </p>
    <p>
      {$_("letter.info_requirement", {default: "Sofern Daten über mich bearbeitet werden, ersuche ich Sie weiter, mir diejenigen Informationen mitzuteilen, die erforderlich sind, damit ich meine Rechte gemäss DSG geltend machen kann und eine transparente Bearbeitung meiner Daten gewährleistet ist."})}
    </p>
    <p>
      {$_("letter.request_info_list", {default: "Ich ersuche Sie in diesem Rahmen, mir in jedem Fall folgende Informationen mitzuteilen:"})}
    </p>
    <ol>
      <li contenteditable spellcheck="false">{$_("letter.list_item_1", {default: "Identität und Kontaktdaten aller Verantwortlichen"})}</li>
      <li contenteditable spellcheck="false">{$_("letter.list_item_2", {default: "Alle bearbeiteten Personendaten als solche"})}</li>
      <li contenteditable spellcheck="false">{$_("letter.list_item_3", {default: "Bearbeitungszweck der Personendaten"})}</li>
      <li contenteditable spellcheck="false">{$_("letter.list_item_4", {default: "Aufbewahrungsdauer der Personendaten"})}</li>
      <li contenteditable spellcheck="false">{$_("letter.list_item_5", {default: "Herkunft der Personendaten"})}</li>
      <li contenteditable spellcheck="false">{$_("letter.list_item_6", {default: "Empfängerinnen und Empfänger der Personendaten"})}</li>
      <li contenteditable spellcheck="false">{$_("letter.list_item_7", {default: "Vorliegen einer automatisierten Einzelentscheidung und deren Logik"})}</li>
    </ol>

    {#if selectedOrg && !selectedEvent}
      {#await selectedOrg then org}
        {#if org.privacyStatement && org.privacyStatement.paragraphs}
          <div class:hide-for-print={hidePrivacyStatementParagraphs}>
            {#each org.privacyStatement.paragraphs as paragraph}
              <Paragraph paragraph={paragraph}></Paragraph>
            {/each}
          </div>
        {/if}
        {#if org.privacyStatement && org.privacyStatement.bullets}
          <Bullets bullets={org.privacyStatement.bullets} on:hidden={handleBulletHiddenChange}></Bullets>
        {/if}
      {/await}
    {/if}

    {#each selectedTypes as type}
      <div class="no-break-inside">
        <h2 contenteditable spellcheck="false">{type.serviceLabel}</h2>
        {#each type.paragraphs as paragraph, i}
          {#if i === 0}
            <Paragraph paragraph={paragraph}></Paragraph>
          {/if}
        {/each}
      </div>
      {#each type.paragraphs as paragraph, i}
        {#if i > 0}
          <Paragraph paragraph={paragraph}></Paragraph>
        {/if}
      {/each}
    {/each}

    <p contenteditable spellcheck="false" class="no-break-after">
      {$_("letter.electronic_form", {default: "Ich bitte Sie, die Auskunft in elektronischer Form zu erteilen, zum Beispiel als PDF- oder CSV-Dateien zum sicheren Download."})}
    </p>
    <p contenteditable spellcheck="false" class="no-break-after">
      {$_("letter.confirm_accuracy", {default: "Ich bitte Sie weiter, die Richtigkeit und Vollständigkeit der erteilten Auskunft zu bestätigen."})}
    </p>
    <p contenteditable spellcheck="false" class="no-break-after">
      {$_("letter.refusal_explanation", {default: "Sollten Sie die Auskunft wider Erwarten nicht, oder nicht vollständig oder noch nicht erteilen können, ersuche ich Sie um Angaben, wieso die Auskunft verweigert, eingeschränkt oder aufgeschoben wird."})}
    </p>
    <p contenteditable spellcheck="false" class="no-break-after">
      {$_("letter.id_copy_purpose", {default: "Die beiliegende Kopie eines amtlichen Ausweises dient ausschliesslich dem Zweck, mich mit angemessenen Massnahmen zu identifizieren. Die Ausweis-Kopie darf für keinen anderen Zweck verwendet werden."})}
    </p>
    <div class="no-break-inside">
       <p contenteditable spellcheck="false" class="no-break-after">
         {$_("closing", {default: "Besten Dank und freundliche Grüsse"})}
       </p>
      <br><br>
       <p
         contenteditable
         spellcheck="false"
         class="editable-variable"
         data-label={$_("your_name", {default: "Dein Name"})}
         class:empty={!$userData.name || $userData.name.length === 0}
         bind:innerHTML={$userData.name}>
       </p>

        <p contenteditable spellcheck="false">
          {$_("attachment_official_id", {default: "Beilage: Amtlicher Ausweis (Kopie)"})}
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

.attachments img {
  display: block;
  max-width: 100%;
  margin-top: 12px;
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

  .attachments {
    margin-top: 30px;
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
  .attachments {
    margin-top: 10px;
    break-before: auto;
    break-inside: avoid;
    page-break-inside: avoid;
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

h1, h2 {
  font-weight: bold;
}

h1 {
  font-size: 18px;
  text-align: left;
}

h2 {
  font-size: 16px;
}

 .before::before, .after::after {
   content: "\A";
   white-space: pre;
 }

</style>