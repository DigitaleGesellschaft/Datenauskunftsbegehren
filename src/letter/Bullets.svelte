<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import HideNodeAction from './HideNodeAction.svelte';
  import { userData } from '../stores.js'

  const dispatch = createEventDispatcher();

  export let bullets = [];
  export let isChild = false

  $: allHashes = getAllHashes(bullets)
  $: topLevelHashes = (bullets || []).map(bullet => bullet.hash)

  function getAllHashes(bullets = []) {
    return bullets
      .flatMap(bullet => {
        if (bullet.bullets) {
          return [bullet.hash]
            .concat(getAllHashes(bullet.bullets))
        } else {
          return bullet.hash
        }
      })
  }

  function setHiddenBullet(hash) {
    userData.update(userData => {
      if (!userData.hiddenBullets) {
        userData.hiddenBullets = []
      }
      userData.hiddenBullets.push(hash);
      return userData;
    })
  }

  function unsetHiddenBullet(hash) {
    userData.update(userData => {
      if (!userData.hiddenBullets) return userData
      userData.hiddenBullets = userData.hiddenBullets.filter(h => h !== hash);
      if (userData.hiddenBullets.length === 0) {
        delete userData.hiddenBullets;
      }
      return userData;
    })
  }

  async function handleToggle(event) {
    const bulletHash = event.detail
    if (isChild) {
      dispatch('toggle', bulletHash)
      return
    }
    const index = ($userData.hiddenBullets || []).indexOf(bulletHash)
    if (index >= 0) {
      unsetHiddenBullet(bulletHash)
    } else {
      setHiddenBullet(bulletHash)
    }

    actOnHiddenBullets()
  }

  function actOnHiddenBullets() {
    const allBulletsHidden = $userData.hiddenBullets && $userData.hiddenBullets.length === allHashes.length
    const allTopLevelHidden = topLevelHashes.every(index => $userData.hiddenBullets && $userData.hiddenBullets.indexOf(index) > -1)

    if (allTopLevelHidden || allBulletsHidden) {
      dispatch('hidden', 'all')
    } else if ($userData.hiddenBullets && $userData.hiddenBullets.length > 0) {
      dispatch('hidden', 'some')
    } else {
      dispatch('hidden', 'none')
    }
  }

  onMount(() => {
    actOnHiddenBullets()
  })
</script>
<ul>
  {#if bullets}
    {#each bullets as bullet}
      <li class:hide-for-print={$userData.hiddenBullets && $userData.hiddenBullets.includes(bullet.hash)}>
        {bullet.text}
        <svelte:self bullets={bullet.bullets} on:toggle={handleToggle} isChild={true}></svelte:self>
        <HideNodeAction on:toggle={handleToggle({detail: bullet.hash})} setClass={false} title="Ein-/ausblenden, damit nur die Daten angefordert werden, die auch bearbeitet werden und von Interesse sind."></HideNodeAction>
      </li>
    {/each}
  {/if}
</ul>

<style>
  ul {
    padding-left: 0px;
    list-style-position: outside;
    margin-left: 30px;
  }

</style>