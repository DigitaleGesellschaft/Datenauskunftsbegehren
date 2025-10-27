import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('de', () => import('./locales/de.json'));
register('fr', () => import('./locales/fr.json'));

init({
  fallbackLocale: 'de',
  initialLocale: getLocaleFromNavigator(),
});
