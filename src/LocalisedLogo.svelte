<script>
  import DigigesLogo from './DigigesLogo.svelte';
  import SonumLogo from './SonumLogo.svelte';
  import { locale } from 'svelte-i18n';

let { ...restProps } = $props();

  const logos = {
    de: DigigesLogo,
    fr: SonumLogo
  };
 
  const LocalisedLogo = $derived(logos[$locale] ?? DigigesLogo);
</script>

<LocalisedLogo></LocalisedLogo>