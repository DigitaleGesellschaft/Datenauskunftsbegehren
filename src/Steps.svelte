<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let activeStep;
</script>
<div class="steps">
  <button class="step" class:active={activeStep === 'entry' || !activeStep} on:click="{() => dispatch('step', 'entry')}">Eingabe</button>
  <!-- ➤ -->
  ❯
  <button class="step" class:active={activeStep === 'letter1'} on:click="{() => dispatch('step', 'letter1')}">Brief</button>
  ❯
  <button class="step" class:active={activeStep === 'print1'} on:click="{() => dispatch('step', 'print1')}">Drucken</button>
</div>
<style>
  .steps {
    color: var(--color-one);
    display: flex;
    align-items: center;
  }
</style>