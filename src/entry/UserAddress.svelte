<script>
  import { userData } from '../stores.js';
</script>
<h3>Deine Adresse</h3>
<label for="userName">Name</label>
<input id="userName" type="text" bind:value="{$userData.name}">
<label for="userAddress">Adresse</label>
<textarea id="userAddress" bind:value="{$userData.address}" rows="4"></textarea>