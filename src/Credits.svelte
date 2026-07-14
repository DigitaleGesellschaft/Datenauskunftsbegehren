<script>
    import BinIcon from './icons/BinIcon.svelte';
    import CheckIcon from './icons/CheckIcon.svelte';
    import CloseIcon from './icons/CloseIcon.svelte';
    import EyeIcon from './icons/EyeIcon.svelte';
    import InfoIcon from './icons/InfoIcon.svelte';
    import ShutterIcon from './icons/ShutterIcon.svelte';
    import ShareIcon from './icons/ShareIcon.svelte';

    import LocalisedLogo from './LocalisedLogo.svelte';
    import { _ } from 'svelte-i18n';
    const digiges_name = $_("digiges_name", {default: "Digitale Gesellschaft"});
    const digiges_url = $_("digiges_url", {default: "https://www.digitale-gesellschaft.ch/"});
    const wikipedia_fragment_url = $_("wikipedia_fragment_url", {default: "https://en.wikipedia.org/wiki/URI_fragment"});
    const art_18_vdsg = $_("art_18_vdsg", {default: "Art. 18 Abs. 1 VDSG"});
    const art_18_vdsg_url = $_("art_18_vdsg_url", {default: "https://www.fedlex.admin.ch/eli/oc/2022/568/de#art_18"});
    const art_25_dsg = $_("art_25_dsg", {default: "Art. 25 DSG"});
    const art_25_dsg_url = $_("art_25_dsg_url", {default: "https://www.fedlex.admin.ch/eli/oc/2022/491/de#art_25"});
    const art_19_vdsg = $_("art_19_vdsg", {default: "Art. 19 VDSG"});
    const art_19_vdsg_url = $_("art_19_vdsg_url", {default: "https://www.fedlex.admin.ch/eli/oc/2022/568/de#art_19"});
    const art_32_dsg = $_("art_32_dsg", {default: "Art. 32 DSG"});
    const art_32_dsg_url = $_("art_32_dsg_url", {default: "https://www.fedlex.admin.ch/eli/oc/2022/491/de#art_32"});
    const mercator_program_url = $_("mercator_program_url", {default: "https://www.stiftung-mercator.ch/unsere-arbeit/digitalisierung-gesellschaft"});
    const mercator_org_url = $_("mercator_org_url", {default: "https://www.stiftung-mercator.ch/"});
    const digiges_rechtliches_url = $_("digiges_rechtliches_url", {default: "https://www.digitale-gesellschaft.ch/uber-uns/rechtliches/"});
    const fragment_label = $_("fragment", {default: "Fragment"});
    const privacy_imprint = $_("privacy_imprint", {default: "Datenschutzerklärung und Impressum"});
    const mercator_program = $_("mercator_program", {default: "Programm «Digitalisierung + Gesellschaft»"});
    const mercator_org = $_("mercator_org", {default: "Stiftung Mercator Schweiz"});
    const generator_source_code = $_("generator_source_code", {default: "Quellcode des Generators"});

</script>

<section class="credits">
  <h1>{$_("credits.title", { default: "Online-Generator für Datenauskunftsbegehren" })}</h1>
  <p>
    {@html $_(
      "credits.website_service",
      {
        default: "Der Online-Generator für Datenauskunftsbegehren wird durch die <digiges_homepage>{digiges_name}</digiges_homepage> zur Verfügung gestellt.",
        values: {digiges_homepage: (text) => `<a target="_blank" rel="noopener noreferrer" href="${digiges_url}">${text}</a>`, digiges_name: digiges_name}
      })}
  </p>
  <p>
    {$_("no_personal_data_collected", { default: "Es werden keine Personendaten bei der Verwendung des Generators erhoben: Sämtliche Dateneingaben und Auswahlen verbleiben im Browser der Benutzer:innen." })}
  </p>
  <p>
    {@html $_(
      "url_storage_info",
      {
        default: "Die Dateneingaben können durch das Kopieren der Adresse der Webseite (URL) gespeichert werden. Sämtliche Information werden dabei im sogenannten <fragment>{fragment_label}</fragment> der URL festgehalten. Dieses wird niemals an einen Webserver gesendet. Die kopierte URL beinhaltet aber sämtliche eingegeben Daten, welche so weiterverwendbar sind. Die URL ist entsprechend mit Vorsicht zu behandeln.",
        values: { fragment: (text) => `<a target="_blank" rel="noopener noreferrer" href="${wikipedia_fragment_url}">${text}</a>`, fragment_label }
      })}
  </p>
  <h2>{$_("notes_for_orgs_title", { default: "Hinweise für angeschriebene Organisationen" })}</h2>
  <p>
    {$_("notes_for_orgs_p1", { default: "Ab dem Zeitpunkt des Eingangs müssen Datenauskunftsbegehren innert 30 Tagen beantwortet werden. Falls die Frist nicht ausreicht, muss entsprechend informiert und die Frist, in der die Auskunft erfolgt, mitgeteilt werden. Falls die Auskunft nicht oder nicht vollständig erteilt werden kann, muss dieser Entscheid begründet werden" })}
    {@html $_(
      "url_art_18_vdsg",
      {
        default: "<art_18_vdsg_url>{art_18_vdsg}</art_18_vdsg_url>",
        values: {
          art_18_vdsg_url: (text) => `<span class="no-wrap">(<a target="_blank" rel="noopener noreferrer" href="${art_18_vdsg_url}">${text}</a>)</span>`,
          art_18_vdsg
        }
      })}
  </p>
  <p>
    {$_("notes_for_orgs_p2", { default: "Das Zusammenstellen der Daten kann einen grösseren Arbeitsaufwand bedeuten. Dennoch ist die Auskunft in der Regel kostenlos zu erteilen. Falls der Zweck oder der Inhalt des Begehrens unklar ist, lohnt es sich allenfalls – gemeinsam mit der gesuchstellenden Person – die Auskunft einzugrenzen." })}
    {@html $_(
      "url_art_25_dsg_art_19_vdsg",
      {
        default: "<art_25_dsg_url>{art_25_dsg}</art_25_dsg_url> <art_19_vdsg_url>{art_19_vdsg}</art_19_vdsg_url>",
        values: {
          art_25_dsg_url: (text) => `<span class="no-warp">(<a target="_blank" rel="noopener noreferrer" href="${art_25_dsg_url}">${text}</a>)</span>`,
          art_19_vdsg_url: (text) => `<span class="no-warp">(<a target="_blank" rel="noopener noreferrer" href="${art_19_vdsg_url}">${text}</a>)</span>`,
          art_25_dsg,
          art_19_vdsg
        }
      })}
  </p>
  <h2>{$_("further_steps_title", { default: "Weitere Schritte" })}</h2>
  <p>
    {$_("further_steps_p1", { default: "Bleibt eine Antwort aus oder ist sie unvollständig, kann mit einem zweiten Brief nachgefasst und darauf hingewiesen werden. Im Anschluss kann gegen private Inhaber von Datensammlungen am Wohnsitz der betroffenen Person oder am Wohnsitz des Inhabers der Datensammlung eine gerichtliche Klage zur Durchsetzung des Auskunftsrechts eingereicht werden" })}
    {@html $_(
      "url_art_25_vdsg",
      {
        default: "<art_25_dsg_url>{art_25_dsg}</art_25_dsg_url>",
        values: {
          art_25_dsg_url: (text) => `<span class="no-wrap">(<a target="_blank" rel="noopener noreferrer" href="${art_25_dsg_url}">${text}</a>)</span>.`,
          art_25_dsg
        }
      })}
  </p>
  <p>
    {$_("further_steps_p2", { default: "Ebenfalls kann die Berichtigung von falschen oder die Löschung von Daten (sowie die weitere Beschaffung) verlangt werden, sofern diese Datenbearbeitung nicht durch ein überwiegendes privates oder öffentliches Interesse oder durch ein Gesetz gerechtfertigt ist" })}
        {@html $_(
      "url_art_32_dsg",
      {
        default: "<art_32_dsg_url>{art_32_dsg}</art_32_dsg_url>",
        values: {
          art_32_dsg_url: (text) => `<span class="no-wrap">(<a target="_blank" rel="noopener noreferrer" href="${art_32_dsg_url}">${text}</a>)</span>.`,
          art_32_dsg
        }
      })}
  </p>
  <h2>{$_("thanks_support_title", { default: "Vielen Dank für die finanzielle Unterstützung" })}</h2>
  <div class="logo-block">
    <p>
      {@html $_(
        "mercator_grant",
        {
          default: "Das Projekt wird vom <program>{mercator_program}</program> der <mercator>{mercator_org}</mercator> gefördert.",
          values: {
            program: (text) => `<a target="_blank" rel="noopener noreferrer" href="${mercator_program_url}">${text}</a>`,
            mercator: (text) => `<a target="_blank" rel="noopener noreferrer" href="${mercator_org_url}">${text}</a>`,
            mercator_program,
            mercator_org
          }
        }
      )}
    </p>
    <a class="logo-link" target="_blank" rel="noopener noreferrer" href="https://www.stiftung-mercator.ch"><img alt={$_("mercator_logo_alt", { default: "Logo Stiftung Mercator" })} width="100px" src="./mercator_logo.png"></a>
  </div>
  <h2>Credits</h2>
  <ul>
    <li><strong>{$_("concept_realisation", { default: "Konzept und Umsetzung" })}</strong>: Beni Buess, Erik Schönenberger, Simon Gantenbein, Nikolaus Langner, Lukas Burkhard, Patrick Uhlmann</li>
    <li><strong>{$_("additional_notes_and_revision", { default: "Ergänzungen und Überarbeitungen" })}</strong>: Anna Walter, Erik Schönenberger, Martin Steiger, Salvi Pittà, Michael Prager, Jack Meyer, Ava Greve, Stefan Schegg</li>
    <li><strong>{$_("campaign", { default: "Kampagne" })}</strong>: Vanessa Peter und das Team der Hochschule der Künste in Bern</li>
    <li>{$_("danke_freunde_ideen", { default: "Danke an viele Freund*innen für die Ideen ♥️" })}</li>
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
  <p>{$_("version", { default: "Version" })}: {__APP_VERSION__} ({__GIT_REVISION__})</p>
  <p>
    {@html $_(
      "code_license_info",
      {
        default: "Der <repo>{generator_source_code}</repo> ist unter der <license>3-Clause BSD Licence</license> lizenziert und auf Github einsehbar.",
        values: {
          repo: (text) => `<a target="_blank" rel="noopener noreferrer" href="https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren">${text}</a>`,
          license: (text) => `<a target="_blank" rel="noopener noreferrer" href="https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren/blob/main/LICENSE">${text}</a>`,
          generator_source_code
        }
      }
    )}
  </p>
  <h2>{$_("legal_title", { default: "Rechtliches" })}</h2>
  <ul>
    <li>
        {@html $_(
        "privacy_imprint_link",
        {
          default: "<privacy_link>{privacy_imprint}</privacy_link>",
          values: {
            privacy_link: (text) => `<a target="_blank" rel="noopener noreferrer" href="${digiges_rechtliches_url}">${text}</a>`,
            privacy_imprint
          }
        })}
    </li>
  </ul>
  <div class="credits-footer">
    <LocalisedLogo></LocalisedLogo>
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
