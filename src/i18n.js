import { register, addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
import deCHLetter from './locales/de-CH.letter.json';
import frCHLetter from './locales/fr-CH.letter.json';

register('de', () => import('./locales/de-CH.json'));
register('fr', () => import('./locales/fr-CH.json'));
register('en', () => import('./locales/en.json'));
register('it', () => import('./locales/it-CH.json'));
addMessages('de-letter', deCHLetter);
addMessages('fr-letter', frCHLetter);

const SUPPORTED_LANGS = ['de', 'fr', 'en', 'it'];

function getInitialLocale() {
  const hash = window.location.hash;
  if (hash.length > 0) {
    try {
      const data = JSON.parse(decodeURI(hash.slice(1)));
      if (SUPPORTED_LANGS.includes(data.langUi)) return data.langUi;
    } catch {}
  }
  return getLocaleFromNavigator();
}

init({
  fallbackLocale: import.meta.env.VITE_DEFAULT_LANG || 'de',
  initialLocale: getInitialLocale(),
  ignoreTag: false
});
