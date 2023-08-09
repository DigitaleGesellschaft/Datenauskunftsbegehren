
<script>
  import { onMount } from 'svelte';
  import { userData } from './stores.js'
  import { get } from 'svelte/store';
  import { getHash } from './lib.js'

  import { addDays, isSaturday, isSunday, lightFormat, addMinutes } from 'date-fns'

  let answerShouldArriveAtDate
  let answerShouldArriveAtTime
  let formNode

  onMount(() => {
    answerShouldArriveAtDate = getTodayPlusDeadline()
    answerShouldArriveAtTime = '09:00'
  })

  function getStringChunks(string, length) {
    const numChunks = Math.ceil(string.length / length)
    const chunks = []
    for (let i = 0, start = 0; i < numChunks; ++i, start += length) {
      chunks.push(string.substr(start, length))
    }
    return chunks
  }

  function getDeadlineDays() {
    const baseDays = 30;
    const additionalDays = 10;
    const totalDays = baseDays + additionalDays;
    const now = Date.now();
    const daysToAdd = isSaturday(now) ? 2 + totalDays : isSunday(now) ? 1 + totalDays  : totalDays;
    return daysToAdd;
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

    const description = `Vor ${getDeadlineDays()} Tagen hast du ein Auskunftsbegehren generiert. Hast du eine Antwort erhalten?\\n\\nHier kannst du den Brief nochmals ansehen:`;
    const comeback = `Bei Fragen kannst Du uns gern über auskunftsbegehren@digitale-gesellschaft.ch kontaktieren.`;

    return `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:digiges/auskunftsbegehren
METHOD:PUBLISH
X-PUBLISHED-TTL:PT1H
BEGIN:VEVENT
UID:${uid}
SUMMARY:Datenauskunftsbegehren, Antwort erhalten?
DTSTAMP:${lightFormat(Date.now(), format)}
DTSTART:${lightFormat(answerShouldArriveAt, format)}
DESCRIPTION:${description}\\n${window.location}\\n\\n${comeback}
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
    var blob = new Blob([event], { type: mimeType });

    var a = document.createElement('a');
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