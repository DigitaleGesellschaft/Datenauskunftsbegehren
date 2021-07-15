<script>
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
          { message.text }
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