import { register, addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
import deCHLetter from './locales/de-CH.letter.json';
import frCHLetter from './locales/fr-CH.letter.json';

register('de', () => import('./locales/de-CH.json'));
register('fr', () => import('./locales/fr-CH.json'));
register('en', () => import('./locales/en.json'));
register('it', () => import('./locales/it-CH.json'));
addMessages('de-letter', deCHLetter);
addMessages('fr-letter', frCHLetter);

export const SUPPORTED_LANGS = ['de', 'fr', 'en', 'it'];

const DEFAULT_LANG = import.meta.env.VITE_DEFAULT_LANG || 'de';

export function getInitialLocale() {
  const hash = window.location.hash;
  if (hash.length > 0) {
    try {
      const data = JSON.parse(decodeURI(hash.slice(1)));
      if (SUPPORTED_LANGS.includes(data.langUi)) return data.langUi;
    } catch {}
  }
  // Normalize the navigator locale (e.g. "en-US") to a supported language ("en").
  // svelte-i18n loads locale messages asynchronously, so the `locale` store is
  // not yet populated when the stores module initializes — callers therefore
  // need this synchronous detection instead of reading `locale`.
  const navLocale = getLocaleFromNavigator();
  if (navLocale) {
    const base = navLocale.toLowerCase().split('-')[0];
    if (SUPPORTED_LANGS.includes(base)) return base;
  }
  return DEFAULT_LANG;
}

init({
  fallbackLocale: DEFAULT_LANG,
  initialLocale: getInitialLocale(),
  ignoreTag: false
});
