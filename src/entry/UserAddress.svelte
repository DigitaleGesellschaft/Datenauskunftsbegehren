<script>
  import { userData } from '../stores.js';
  import { _ } from 'svelte-i18n';
</script>
<h3>{$_("your_address", { default: "Deine Adresse" })}</h3>
<label for="userName">{$_("name", { default: "Name" })}</label>
<input id="userName" type="text" bind:value="{$userData.name}">
<label for="userAddress">{$_("address", { default: "Adresse" })}</label>
<textarea id="userAddress" bind:value="{$userData.address}" rows="4"></textarea>