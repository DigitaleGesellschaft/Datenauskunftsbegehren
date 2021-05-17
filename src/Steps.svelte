<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let activeStep;
</script>
<div class="steps">
  <button class="step" class:active={activeStep === 'entry' || !activeStep} on:click="{() => dispatch('step', 'entry')}">Eingabe</button>
  <!-- ➤ -->
  ❯
  <button class="step" class:active={activeStep === 'letter'} on:click="{() => dispatch('step', 'letter')}">Brief</button>
  ❯
  <button class="step" class:active={activeStep === 'print'} on:click="{() => dispatch('step', 'print')}">Drucken</button>
</div>
<style>
  .steps {
    color: var(--color-one);
    display: flex;
    align-items: center;
  }
</style>