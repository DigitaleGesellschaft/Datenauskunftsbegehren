<script>
  import { _ } from 'svelte-i18n';
  import { langUi, langCor } from './stores.js';

  const uiLanguages = [
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
  ];

  const correspondenceLanguages = [
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
  ];
</script>

<div class="language-picker">
  <h2>{$_('language_picker.title', { default: 'Spracheinstellungen' })}</h2>

  <fieldset>
    <legend>{$_('language_picker.ui_language', { default: 'Benutzeroberflächensprache' })}</legend>
    {#each uiLanguages as lang}
      <label>
        <input
          type="radio"
          name="ui-language"
          value={lang.code}
          checked={$langUi === lang.code}
          onchange={() => langUi.set(lang.code)}
        />
        {lang.label}
      </label>
    {/each}
  </fieldset>

  <fieldset>
    <legend>{$_('language_picker.correspondence_language', { default: 'Korrespondenzsprache' })}</legend>
    {#each correspondenceLanguages as lang}
      <label>
        <input
          type="radio"
          name="correspondence-language"
          value={lang.code}
          checked={$langCor === lang.code}
          onchange={() => langCor.set(lang.code)}
        />
        {lang.label}
      </label>
    {/each}
  </fieldset>
</div>

<style>
  .language-picker {
    padding: 12px;
    max-width: 400px;
  }

  h2 {
    margin-bottom: 24px;
  }

  fieldset {
    border: 1px solid var(--color-ui-one);
    border-radius: 4px;
    padding: 12px 16px;
    margin-bottom: 16px;
  }

  legend {
    padding: 0 6px;
    font-weight: bold;
  }

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    cursor: pointer;
  }

  input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--color-brand);
  }
</style>
