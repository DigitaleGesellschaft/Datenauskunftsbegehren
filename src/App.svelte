<script>
  import { onMount, tick } from 'svelte';

  import Header from './Header.svelte'
  import Letter1 from './letter/Letter1.svelte'
  import Letter2a from './letter/Letter2a.svelte'
  import Entry from './entry/Entry.svelte'
  import Share from './Share.svelte'
  import Messages from './Messages.svelte'
  import IcsDownload from './IcsDownload.svelte'
  import DigigesLogo from './DigigesLogo.svelte'

  import texts from './texts.js'
  
  import { userData, userAddressHtml, orgAddressHtml } from './stores.js'

  let canPrint = undefined;

  async function setStep({detail}) {
    const step = detail;
    userData.update(userData => {
      userData.step = step;
      return userData;
    })

    await tick();
    
    if (step === 'print1') {
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
    userData.set({})
    userAddressHtml.set('')
    orgAddressHtml.set('')
  }

  onMount(async () => {
    document.querySelector('#loader').remove();
    document.querySelector('.nomodule-message').remove();
  })
</script>
<Header on:step={setStep} activeStep={$userData.step}></Header>
<main>

  <Messages></Messages>

  {#if !$userData.step}
    <div class="init">
      <h1>{texts.title}</h1>
      <p>{texts.intro}</p>
    </div>
  {/if}

  {#if !$userData.step || $userData.step === 'entry'}
    <div class="step-ui step-entry">
      <Entry on:step={setStep} on:reset={reset}></Entry>
    </div>
  {/if}

  {#if $userData.step === 'print1' && canPrint === true}
    <div class="step-ui step-print">
      <div>
        <h2>Geschafft</h2>
        <p>
          Nun musst du das Datenauskunftsbegehren noch <strong>eingeschrieben per Post versenden</strong>.
        </p>
        <p>
          Ab dem Eingang bleiben 30 Tage für die Beantwortung.
          Speichere einen Termin im Kalender, um dich für ein allfälliges Nachfragen erinnern zu lassen, falls du bis dahin keine Antwort erhalten hast.
        </p>
        <IcsDownload></IcsDownload>
        <p>
          Rückmeldungen nehmen wir unter <a href="mailto:auskunftsbegehren@digitale-gesellschaft.ch">auskunftsbegehren@digitale-gesellschaft.ch</a> gerne entgegen.
        </p>
        <p>
        Unser Generator wurde von IT- und Rechtskundigen der Digitalen Gesellschaft in unzähligen Stunden entwickelt und steht allen frei zur Verfügung. 
        Als <a target="_blank" rel="noopener noreferrer" href="https://www.digitale-gesellschaft.ch/uber-uns/unterstuetzer-werden/">Mitglied, Spender oder Gönnerin</a> unterstützt du unsere Arbeit.
        Falls du über unsere Aktivitäten auf dem Laufenden gehalten werden möchtest, abonniere jetzt den <a target="_blank" rel="noopener noreferrer" href="https://www.digitale-gesellschaft.ch/uber-uns/newsletter/">monatlichen Newsletter</a>.
        </p>
      </div>
    </div>
  {/if}

  {#if $userData.step === 'print1' && canPrint === false}
    <div class="step-ui">
      <div>
        <h2>Sende dir die Webadresse</h2>
        <p>Auf deinem Gerät ist Drucken leider nicht möglich. Verwende die Möglichkeit, die Webadresse (URL) zu senden, um sie dir beispielsweise per E-Mail zu schicken. Du kannst sie dann auf einem passenden Gerät mit Drucker öffnen. Die eingegebenen Daten sind in der URL gespeichert.</p>
      </div>
    </div>
  {/if}

  {#if $userData.step === 'letter1' || $userData.step === 'id' || $userData.step === 'print1'}
    <Letter1></Letter1>
    <div class="actions">
      <button class="one no-print" on:click="{() => setStep({detail: 'entry'})}">❮ zur Dateneingabe</button>
      <button class="one no-print" on:click="{() => setStep({detail: 'print1'})}">Jetzt drucken ❯</button>
    </div>
    <Share></Share>
  {/if}
  {#if $userData.step === 'letter2a'}
    <Letter2a></Letter2a>
    <div class="actions">
      <button class="one no-print" on:click="{() => setStep({detail: 'entry'})}">❮ zur Dateneingabe</button>
      <button class="one no-print" on:click="{() => setStep({detail: 'print1'})}">Jetzt drucken ❯</button>
    </div>
    <Share></Share>
  {/if}

  <footer>
    <a href="https://www.digitale-gesellschaft.ch" target="_blank" rel="noopener noreferrer">
      <DigigesLogo></DigigesLogo>
    </a>
  </footer>
</main>
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
</style>