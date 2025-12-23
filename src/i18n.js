import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('de', () => import('./locales/de-CH.json'));
register('fr', () => import('./locales/fr-CH.json'));

init({
  fallbackLocale: 'de',
  initialLocale: getLocaleFromNavigator(),
  ignoreTag: false
});
