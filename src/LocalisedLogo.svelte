<script>
  import DigigesLogo from './DigigesLogo.svelte';
  import SonumLogo from './SonumLogo.svelte';
  import SodigLogo from './SodigLogo.svelte';
  import DigisocLogo from './DigisocLogo.svelte';
  import { locale } from 'svelte-i18n';

let { ...restProps } = $props();

  const logos = {
    de: DigigesLogo,
    fr: SonumLogo,
    it: SodigLogo,
    en: DigisocLogo
  };
 
  const LocalisedLogo = $derived(logos[$locale] ?? DigigesLogo);
</script>

<LocalisedLogo></LocalisedLogo>