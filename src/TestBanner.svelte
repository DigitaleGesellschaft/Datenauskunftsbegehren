<svelte:head>
  <style>:root { --banner-height: 40px; }</style>
</svelte:head>

<div class="test-banner">
  Dies ist ein <strong>Testsystem</strong>.
  Das produktive System findest du unter
  <a href="https://www.digitale-gesellschaft.ch/auskunftsbegehren" target="_blank" rel="noopener noreferrer">
    digitale-gesellschaft.ch/auskunftsbegehren
  </a>
</div>

<style>
  .test-banner {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: var(--banner-height);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4em;

    background: #f5a800;
    color: #000;
    font-size: 14px;
    font-weight: 300;
  }

  .test-banner a {
    color: #000;
    font-weight: 700;
  }

  .test-banner a:visited {
    filter: none;
  }

  @media print {
    .test-banner {
      display: none;
    }
  }
</style>
