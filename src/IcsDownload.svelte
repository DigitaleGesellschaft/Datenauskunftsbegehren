
<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { getHash } from './lib.js'
  import { addDays, isSaturday, isSunday, lightFormat, addMinutes } from 'date-fns'
  import { userData } from './stores.js'
  import { getCausa } from './texts.js'

  let answerShouldArriveAtDate
  let answerShouldArriveAtTime
  let description;

  let formNode

  onMount(() => {
    answerShouldArriveAtDate = getTodayPlusDeadline()
    answerShouldArriveAtTime = '09:00'
    description = 'Vor ' + getDeadlineDays() + ' Tagen hast du ' + getCausa($userData.desire, 'cal') + ' generiert. Hast du eine Antwort erhalten?';
  })

  function getStringChunks(string, length) {
    const numChunks = Math.ceil(string.length / length)
    const chunks = []
    for (let i = 0, start = 0; i < numChunks; ++i, start += length) {
      chunks.push(string.slice(start, length))
    }
    return chunks
  }

  function getDeadlineDays() {
    const processingPeriod = 30;
    const additionalWaitingPeriod = 10;
    const now = Date.now();
    const weekendDays = isSaturday(now) ? 2 : isSunday(now) ? 1 : 0;
    return processingPeriod + additionalWaitingPeriod + weekendDays;
  }

  function getTodayPlusDeadline() {
    const daysToAdd = getDeadlineDays()
    const now = Date.now();
    const date = addDays(now, daysToAdd)
    return lightFormat(date, 'yyyy-MM-dd')
  }

  async function getIcs() {
    const format = `yyyyMMdd'T'HHmm00'Z'`;
    const d = new Date(`${answerShouldArriveAtDate} ${answerShouldArriveAtTime}`);
    const timezoneOffset = d.getTimezoneOffset();
    const answerShouldArriveAt = addMinutes(d, timezoneOffset);

    const icsMaxLineLength = 75;
    let uid = '@digiges.ch/auskunftsbegehren';
    const id = await getHash({text: JSON.stringify(get(userData))}) + Date.now() + Math.floor(Math.random() * Math.pow(10, 3));
    uid = `${id.slice(0,icsMaxLineLength - (uid.length + 'UID:'.length))}${uid}`;
    /**
     * In der URL ist der aktuelle Schritt des minimalistischen Workflows notiert.
     * Enthält die URL die ursprünglichen Einstellungen (Name, Adresse, Konversationspartner),
     * kann in die Auswahl der Aktionen des Nachfassenen gesprungen werden.
     */
    let followup_url = '';
    try {
      followup_url = window.location.href.replace('print', 'entry');
    } catch (e) {
      console.log("Exception: " + e.toLocaleString());
    }
    const followup = 'Hier kannst Du Briefe zum Nachfassen oder weitere Auskunftsbegehren erstellen';
    const comeback = 'Bei Fragen kannst Du uns gern über auskunftsbegehren@digitale-gesellschaft.ch kontaktieren.';

    /**
     * CAL massages due to recent updates to the standards and tools
     * 1. X-PUBLISHED-TTL:PT1H
     *    There seems to be no server at all for this as we provide with an individual reminder
     *    If there is a server, it should use REFRESH-INTERVAL (RFC-7968)
     */
    return `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:digiges/auskunftsbegehren
METHOD:PUBLISH
REFRESH-INTERVAL:PT12H
BEGIN:VEVENT
UID:${uid}
SUMMARY:Datenauskunftsbegehren, Antwort erhalten?
DTSTAMP:${lightFormat(Date.now(), format)}
DTSTART:${lightFormat(answerShouldArriveAt, format)}
DESCRIPTION:${description}\\n${followup}: ${followup_url}\\n\\n${comeback}
DURATION:PT15M
END:VEVENT
END:VCALENDAR
`
  }

  async function downloadIcs() {
    if (!formNode.checkValidity()) {
      formNode.reportValidity()
      return
    }
    const event = await getIcs();

    const mimeType = 'text/calendar';
    let blob = new Blob([event], { type: mimeType });

    let a = document.createElement('a');
    a.download = 'auskunftsbegehren.ics';
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [mimeType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
  }
</script>

<form class="ics-download" bind:this={formNode}>
  <div class="form-input-group-input">
    <label for="date">Datum</label>
    <input id="date" type="date" bind:value={answerShouldArriveAtDate} required>
  </div>
  <div class="form-input-group-input">
    <label for="time">Zeit</label>
    <input id="time" type="time" bind:value={answerShouldArriveAtTime} required>
  </div>
  <button type="button" class="one" on:click={downloadIcs}>Kalendereintrag herunterladen</button>
</form>

<style>
  .ics-download {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: left;
    align-items: flex-end;
    margin-bottom: 36px;
  }

  @media print {
    .ics-download {
      display: none;
    }
  }
</style>