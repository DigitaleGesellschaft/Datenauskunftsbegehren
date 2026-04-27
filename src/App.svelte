<script>
  import { onMount, tick } from 'svelte';
  import { _, isLoading } from 'svelte-i18n';

  import Header from './Header.svelte'
  // Auskunftsbegehren
  import LetterDataInfoReq from './letter/LetterDataInfoReq.svelte'
  // Auskunftsbegehren - Ausbleibende Auskunft
  // Keine Reaktion auf Auskunftsbegehren
  import LetterDataInfoReqRemind from './letter/LetterDataInfoReqRemind.svelte'
  // Auskunftsbegehren - Unvollständige Auskunft
  // Unvollständige Auskunft nach Auskunftsbegehren
  import LetterDataInfoReqDemand from './letter/LetterDataInfoReqDemand.svelte'
  // Auskunftsbegehren - Korrektur von Daten
  // Berichtigungsbegehren nach erteilter Auskunft
  import LetterDataInfoReqChange from './letter/LetterDataInfoReqChange.svelte'
  // Auskunftsbegehren - Löschung von Daten
  // Löschbegehren nach erteilter Auskunft
  import LetterDataInfoReqDelete from './letter/LetterDataInfoReqDelete.svelte'
  // Auskunftsbegehren - Herausgabe von Daten
  // Begehren zur Herausgabe nach erteilter Auskunft
  import LetterDataInfoReqHandover from './letter/LetterDataInfoReqHandover.svelte'

  import Entry from './entry/Entry.svelte'
  import Share from './Share.svelte'
  import Messages from './Messages.svelte'
  import IcsDownload from './IcsDownload.svelte'
  import DigigesLogo from './DigigesLogo.svelte'
  import TestBanner from './TestBanner.svelte'

  const showTestBanner = import.meta.env.VITE_TEST_BANNER === 'true'

  import {data, userData, userAddressHtml, orgAddressHtml, userDesire, langUi, langCor} from './stores.js'
  import { get } from 'svelte/store'
  let desires = $derived($data && $data.desires ? $data.desires : [])

  const MEMBERSHIP_LINK = 'https://www.digitale-gesellschaft.ch/uber-uns/unterstuetzer-werden/'
  const NEWSLETTER_LINK = 'https://www.digitale-gesellschaft.ch/uber-uns/newsletter/'

  let normalizedDesire = $derived(
    ($userData.desire === 'letter' ? 'data_info_request' : $userData.desire) || 'data_info_request'
  )

  // hack: override state mix with multiple letter types after printing one and recalling the letter view
  let canPrint = $state(true);

  async function setStep({detail}) {
    const step = detail;
    userData.update(userData => {
      userData.step = step;
      return userData;
    })

    await tick();

    if (step === 'print') {
      const timeout = window.setTimeout(() => {
        canPrint = false;
        window.scrollTo({top: 0, behavior: 'smooth'})
      }, 200)
      window.addEventListener("beforeprint", () => {
        window.clearTimeout(timeout);
        canPrint = true;
        window.scrollTo({top: 0, behavior: 'smooth'})
      });
      window.print();
    }
  }

  function reset() {
    userData.set({ langUi: get(langUi), langCor: get(langCor) })
    userAddressHtml.set('')
    orgAddressHtml.set('')
    userDesire.set('')
  }

  onMount(async () => {
    document.querySelector('#loader').remove();
    document.querySelector('.nomodule-message').remove();

    // switch step name "letter" into "data_info_request" to update URL data from older info requests
    if ($userData.step === 'letter') {
      userData.update( userData => {
        userData.step = 'data_info_request';
        return userData;
      })
      setStep({detail: 'data_info_request'})
    }
  })

  let followUpHidden = $state(true);
  function hideUnhideFollowUp() {
    followUpHidden = ! followUpHidden;
  }

</script>
<svelte:head>
  <title>{$_('meta.title')}</title>
  <meta name="description" content={$_('meta.description')} />
  <meta property="og:title" content={$_('meta.og_title')} />
  <meta property="og:description" content={$_('meta.og_description')} />
  <meta property="og:image" content="https://www.digitale-gesellschaft.ch/auskunftsbegehren/datenauskunftsbegehren-og.png" />
  <link rel="preload" href="./fonts/Montserrat/latin-300.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href="./fonts/Montserrat/latin-700.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{#if $isLoading}
  <p>Loading...</p>
{:else}

{#if showTestBanner}<TestBanner />{/if}
<Header on:step={setStep} activeStep={$userData.step}></Header>
<main>

  <Messages></Messages>

  {#if !$userData.step}
    <div class="init">
      <h1>{$_('app.title', { default: 'Generiere dein Datenauskunftsbegehren' })}</h1>
      <p>{$_('app.intro', { default: 'Gemäss Datenschutzgesetz hat jede Person das Recht zu erfahren, welche Daten über sie gespeichert sind, und diese – wenn nötig – löschen oder korrigieren zu lassen. Dieses Auskunftsrecht ermöglicht es, die Kontrolle über die eigenen Personendaten zu behalten. Jede Person muss aber selber aktiv werden und dieses Recht wahrnehmen.' })}</p>
    </div>
  {/if}

  {#if !$userData.step || $userData.step === 'entry'}
    <div class="step-ui step-entry">
      <Entry on:step={setStep} on:reset={reset}></Entry>
    </div>
  {/if}

  {#if $userData.step === 'print'}
    {#if canPrint === true}
      <div class="step-ui step-print">
        <div>
          <h2>{$_('print.done_title', { default: 'Geschafft' })}</h2>
          <p>{@html $_('print.send_by_post', {
            default: 'Nun musst du {causa} noch <strong>eingeschrieben per Post versenden</strong>.',
            values: { causa: $_('causa.print.' + normalizedDesire) }
          })}</p>
          <p>{$_('print.deadline_info', { default: 'Ab dem Eingang bleiben 30 Tage für die Beantwortung. Speichere einen Termin im Kalender, um dich für ein allfälliges Nachfragen erinnern zu lassen, falls du bis dahin keine Antwort erhalten hast.' })}</p>
          <IcsDownload></IcsDownload>
          <p>{@html $_('print.feedback', {
            default: 'Rückmeldungen nehmen wir unter <email_link>auskunftsbegehren@digitale-gesellschaft.ch</email_link> gerne entgegen.',
            values: { email_link: (text) => `<a href="mailto:auskunftsbegehren@digitale-gesellschaft.ch">${text}</a>` }
          })}</p>
          <p>
            {$_('print.support_us_intro', { default: 'Unser Generator wurde von IT- und Rechtskundigen der Digitalen Gesellschaft in unzähligen Stunden entwickelt und steht allen frei zur Verfügung.' })}
            {@html $_('print.support_us_membership', {
              default: 'Als <membership_link>Mitglied, Spender oder Gönnerin</membership_link> unterstützt du unsere Arbeit.',
              values: { membership_link: (text) => `<a target="_blank" rel="noopener noreferrer" href="${MEMBERSHIP_LINK}">${text}</a>` }
            })}
            {@html $_('print.support_us_newsletter', {
              default: 'Falls du über unsere Aktivitäten auf dem Laufenden gehalten werden möchtest, abonniere jetzt den <newsletter_link>monatlichen Newsletter</newsletter_link>.',
              values: { newsletter_link: (text) => `<a target="_blank" rel="noopener noreferrer" href="${NEWSLETTER_LINK}">${text}</a>` }
            })}
          </p>
        </div>
      </div>
    {:else}
      <div class="step-ui">
        <div>
          <h2>{$_('print.no_print_title', { default: 'Sende dir die Webadresse' })}</h2>
          <p>{$_('print.no_print_text', { default: 'Auf deinem Gerät ist Drucken leider nicht möglich. Verwende die Möglichkeit, die Webadresse (URL) zu senden, um sie dir beispielsweise per E-Mail zu schicken. Du kannst sie dann auf einem passenden Gerät mit Drucker öffnen. Die eingegebenen Daten sind in der URL gespeichert.' })}</p>
        </div>
      </div>
    {/if}
  {/if}

  {#if $userData.step && $userData.step !== 'entry'}
    <Share></Share>
    {#if $userData.step === 'data_info_request' || ($userData.step === 'print' && ($userData.entry !== 'followup' || $userData.desire === 'data_info_request'))}
      <LetterDataInfoReq></LetterDataInfoReq>
    {/if}
    {#if $userData.entry === 'followup' && $userData.desire !== 'data_info_request'}
      {#if $userData.desire === 'unanswered'}
        <LetterDataInfoReqRemind></LetterDataInfoReqRemind>
      {:else if $userData.desire === 'incomplete_answer'}
        <LetterDataInfoReqDemand></LetterDataInfoReqDemand>
      {:else if $userData.desire === 'data_correction'}
        <LetterDataInfoReqChange></LetterDataInfoReqChange>
      {:else if $userData.desire === 'data_deletion'}
        <LetterDataInfoReqDelete></LetterDataInfoReqDelete>
      {:else if $userData.desire === 'data_handover' || $userData.step === 'print' }
        <LetterDataInfoReqHandover></LetterDataInfoReqHandover>        
      {/if}
    {/if}
    <div class="actions">
      <button class="one no-print" onclick={() => setStep({detail: 'entry'})}>{$_('nav.back_to_entry', { default: '❮ zur Dateneingabe' })}</button>
      {#if $userData.step === 'data_info_request'}
        <button class="one no-print" onclick={hideUnhideFollowUp}>{$_('nav.followup', { default: 'Nachfassen' })}</button>
      {/if}
      <button class="one no-print" onclick={() => setStep({detail: 'print'})}>{$_('nav.print_now', { default: 'Jetzt drucken ❯' })}</button>
    </div>
    {#if !followUpHidden}
      <div class="step-ui step-entry">
        <div class="separator"><span></span></div>
        <section>
          <h2>{$_('steps_one.followup', { default: 'Zu einem bereits gestellten Datenauskunftsbegehren nachfassen' })}</h2>
          {#each desires as desire}
              <button class="one" onclick={() => {$userData.entry = 'followup'; $userData.desire = desire.handle; setStep({detail: desire.handle}); }}>{desire.label}</button>
          {/each}
        </section>
      </div>
    {/if}
  {/if}

  <footer>
    <a href="https://www.digitale-gesellschaft.ch" target="_blank" rel="noopener noreferrer">
      <DigigesLogo></DigigesLogo>
    </a>
  </footer>
</main>
{/if}
<style>

  .init {
    color: white;
    width: 100%;
    max-width: 800px;
  }
  .step-ui {
    padding: 12px;
    flex-grow: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    top: var(--header-height);
    background: var(--color-ui-three);
    border: 1px solid var(--color-ui-one);
    border-radius: 12px;
    margin: 12px;
    max-width: 800px;
  }

  .step-ui.step-print {
    background: rgba(255, 255, 255, 0.6);
  }
  :global(.step-ui.step-print input) {
    background: rgba(255,255,255,0.5)
  }
  :global(.step-ui.step-print button) {
    background: rgba(255,255,255,0.5)
  }

  .actions {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 210mm;
    gap: 24px;
    margin-top: 24px;
    margin-bottom: 12px;
  }

  @media print {
    .step-ui {
      display: none;
    }

    .actions {
      display: none;
    }
  }

  section {
    padding: 0 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  section h2 {
    width: 100%;
    margin-top: 24px;
    margin-bottom: 12px;
  }
  button {
    width: auto;
  }
  .separator span {
    background: var(--color-ui-three);
    position: relative;
    padding: 10px;
  }
</style>