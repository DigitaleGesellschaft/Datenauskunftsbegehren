<script>
    import BinIcon from './icons/BinIcon.svelte';
    import CheckIcon from './icons/CheckIcon.svelte';
    import CloseIcon from './icons/CloseIcon.svelte';
    import EyeIcon from './icons/EyeIcon.svelte';
    import InfoIcon from './icons/InfoIcon.svelte';
    import ShutterIcon from './icons/ShutterIcon.svelte';
    import ShareIcon from './icons/ShareIcon.svelte';

    import DigigesLogo from './DigigesLogo.svelte'

</script>

<section class="credits">
  <h1>
    Online-Generator für Datenauskunftsbegehren
  </h1>
  <p>
    Der Online-Generator für Datenauskunftsbegehren wird durch die <a target="_blank" rel="noopener noreferrer" href="https://www.digitale-gesellschaft.ch">Digitale Gesellschaft</a> zur Verfügung gestellt.
  </p>
  <p>
    Es werden keine Personendaten bei der Verwendung des Generators erhoben: Sämtliche Dateneingaben und Auswahlen verbleiben im Browser der Benutzer:innen.
  </p>
  <p>
    Die Dateneingaben können durch das Kopieren der Adresse der Webseite (URL) gespeichert werden. Sämtliche Information 
    werden dabei im sogenannten <a target="_blank" rel="noopener noreferrer" href="https://de.wikipedia.org/wiki/Fragmentbezeichner">Fragment</a> der URL festgehalten. 
    Dieses wird niemals an einen Webserver gesendet. Die kopierte URL beinhaltet aber sämtliche eingegeben Daten, welche so weiterverwendbar sind. Die URL ist entsprechend mit Vorsicht zu behandeln.
  </p>
  <h2>Hinweise für angeschriebene Organisationen</h2>
  <p>
    Ab dem Zeitpunkt des Eingangs müssen Datenauskunftsbegehren innert 30 Tagen beantwortet werden. Falls die Frist nicht ausreicht, muss entsprechend informiert und die Frist, 
    in der die Auskunft erfolgt, mitgeteilt werden. Falls die Auskunft nicht oder nicht vollständig erteilt werden kann,
    muss dieser Entscheid begründet werden. <span class="no-wrap">(<a target="_blank" rel="noopener noreferrer" href="https://www.fedlex.admin.ch/eli/oc/2022/568/de#art_18">Art. 18 Abs. 1 VDSG</a>)</span>
  </p>
  <p>
    Das Zusammenstellen der Daten kann einen grösseren Arbeitsaufwand bedeuten. Dennoch ist die Auskunft in der Regel kostenlos zu erteilen.
    Falls der Zweck oder der Inhalt des Begehrens unklar ist, lohnt es sich allenfalls – gemeinsam mit der gesuchstellenden Person –
    die Auskunft einzugrenzen.<span class="no-warp">(<a target="_blank" rel="noopener noreferrer" href="https://www.fedlex.admin.ch/eli/oc/2022/491/de#art_25">Art. 25 DSG</a>)</span>
    <span class="no-wrap">(<a target="_blank" rel="noopener noreferrer" href="https://www.fedlex.admin.ch/eli/oc/2022/568/de#art_19">Art. 19 VDSG</a>)</span>
  </p>
  <h2>Weitere Schritte</h2>
  <p>
    Bleibt eine Antwort aus oder ist sie unvollständig, kann mit einem zweiten Brief nachgefasst und darauf hingewiesen werden. Im Anschluss kann gegen private Inhaber von Datensammlungen 
    am Wohnsitz der betroffenen Person oder am Wohnsitz des Inhabers der Datensammlung eine gerichtliche Klage zur Durchsetzung
    des Auskunftsrechts eingereicht werden. <span class="no-warp">(<a target="_blank" rel="noopener noreferrer" href="https://www.fedlex.admin.ch/eli/oc/2022/491/de#art_25">Art. 25 DSG</a>)</span>
  </p>
  <p>
    Ebenfalls kann die Berichtigung von falschen oder die Löschung von Daten (sowie die weitere Beschaffung) verlangt werden, 
    sofern diese Datenbearbeitung nicht durch ein überwiegendes privates oder öffentliches Interesse oder
    durch ein Gesetz gerechtfertigt ist. <span class="no-wrap">(<a target="_blank" rel="noopener noreferrer" href="https://www.fedlex.admin.ch/eli/oc/2022/491/de#art_32">Art. 32 DSG</a>)</span>
  </p>
  <h2>Vielen Dank für die finanzielle Unterstützung</h2>
  <div class="logo-block">
    <p>
      Das Projekt wird vom <a target="_blank" rel="noopener noreferrer" href="https://www.stiftung-mercator.ch/digitalisierung-gesellschaft">Programm «Digitalisierung + Gesellschaft»</a>
      der <a target="_blank" rel="noopener noreferrer" href="https://www.stiftung-mercator.ch">Stiftung Mercator Schweiz</a> gefördert.
    </p>
    <a class="logo-link" target="_blank" rel="noopener noreferrer" href="https://www.stiftung-mercator.ch"><img alt="Logo Stiftung Mercator" width="100px" src="./mercator_logo.png"></a>
  </div>
  <h2>Credits</h2>
  <ul>
    <li><strong>Konzept und Umsetzung</strong>: Beni Buess, Erik Schönenberger, Simon Gantenbein, Nikolaus Langner</li>
    <li><strong>Ergänzungen und Überarbeitungen</strong>: Anna Walter, Erik Schönenberger, Martin Steiger</li>
    <li><strong>Kampagne</strong>: Vanessa Peter und das Team der Hochschule der Künste in Bern</li>
    <li>Danke an viele Freund*innen für die Ideen ♥️</li>
    <li>Built for the Web using HTML, CSS, JavaScript and <a target="_blank" rel="noopener noreferrer" href="https://svelte.dev/">Svelte</a></li>
    <li>Icons from <a target="_blank" rel="noopener noreferrer" href="https://thenounproject.com">the Noun Project</a>: 
      <ul>
        <li>
          <span class="icon-credit-line">
            <BinIcon></BinIcon> <CheckIcon></CheckIcon> <CloseIcon></CloseIcon> <EyeIcon></EyeIcon> <InfoIcon></InfoIcon>created by <a href="https://thenounproject.com/gabrielemalaspina/" target="_blank" rel="noopener noreferrer">Gabriele Malaspina</a>
          </span>
        </li>
        <li>
          <span class="icon-credit-line">
            <ShutterIcon></ShutterIcon> created by <a href="https://thenounproject.com/jjaysonn/" target="_blank" rel="noopener noreferrer">jayson lim</a>
          </span>
        </li>
        <li>
          <span class="icon-credit-line">
            <ShareIcon></ShareIcon> created by <a href="https://thenounproject.com/flatdesigntheory/" target="_blank" rel="noopener noreferrer">Memed Nurrohmad</a>
          </span>
        </li>
      </ul>
    </li>
  </ul>
  <h2>Code</h2>
  <p>
    Der <a target="_blank" rel="noopener noreferrer" href="https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren">Quellcode des Generators</a> ist unter der <a target="_blank" rel="noopener noreferrer" href="https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren/blob/main/LICENSE">3-Clause BSD Lizenz</a> lizenziert und auf Github einsehbar.
  </p>
  <h2>Rechtliches</h2>
  <ul>
    <li><a target="_blank" rel="noopener noreferrer" href="https://www.digitale-gesellschaft.ch/uber-uns/rechtliches/">Datenschutzerklärung und Impressum</a></li>
  </ul>
  <div class="credits-footer">
    <DigigesLogo></DigigesLogo>
  </div>
</section>

<style>
  h1, h2, p, ul, .logo-block {
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  p, .logo-block {
    margin-top: 18px;
    margin-bottom: 18px;
  }

  ul {
    padding-left: 30px;
    list-style-position: outside;
  }

  ul li {
    padding: 3px 0;
  }

  ul li ul li {
    padding: 0;
  }

  .icon-credit-line a {
    margin-left: 4px;
  }

  :global(.icon-credit-line svg) {
    margin-right: 6px;
    position: relative;
    top: 4px;
  }

  svg {
    width: 1em;
    height: 1em;
  }

  .no-wrap {
    white-space: nowrap;
  }

  @media screen and (min-width: 600px) {
    .logo-block {
      display: flex;
    }
  }

  .logo-block p:first-child {
    margin-top: 0;
  }

  .logo-link:hover {
    transform: none;
  }

  :global(.credits-footer svg) {
    display: block;
    width: 50%;
    max-width: 200px;
    margin: 10px auto 20px auto;
  }
</style>