<script>
  import { _ } from 'svelte-i18n'
  import { messages } from './stores.js'

  let iconsForType = {
    error: '🚨',
    message: '👉'
  }
</script>

{#if $messages.length > 0}
  <div class="messages">
    {#each $messages as message}
      <div class="message">
        <div class="icon">
          {iconsForType[message.type]}
        </div>
        <div class="text">
          {#if message.key === 'org_not_in_dataset'}
            {$_('messages.org_not_in_dataset', {
              default: 'Die Organisation {org} ist nicht (mehr) im Datensatz vorhanden. Deine Eingabe wurde zurückgesetzt.',
              values: { org: message.values.org }
            })}
          {:else if message.key === 'org_removed_from_list'}
            {$_('messages.org_removed_from_list', {
              default: 'Die Organisation {org} wurde am {date} aus der Liste entfernt. {reason}',
              values: { org: message.values.org, date: message.values.date, reason: message.values.reason }
            })}
          {:else}
            { message.text }
          {/if}
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  .messages {
    padding: 12px;
    flex-grow: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    top: var(--header-height);
    background: var(--color-ui-three);
    border: 1px solid var(--color-ui-one);
    border-radius: 12px;

    margin: 12px;
    max-width: 800px;
  }

  .message {
    display: flex;
    align-items: flex-start;
  }
  .icon {
    width: 30px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  @media print {
    .messages {
      display: none;
    }
  }
</style>