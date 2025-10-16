<script>
  /**
   * @typedef {Object} Props
   * @property {number} [width]
   * @property {number} [height]
   */

  /** @type {Props} */
  let { width = 20, height = 20 } = $props();
</script>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="{width}" height="{height}" viewBox="0 0 100 100">
  <path d="M67.5 57.3c-2.8 0-5.3 1.1-7.2 2.9l-19.9-9.7c.1-.7.2-1.4.2-2.2 0-.8-.1-1.5-.2-2.2l19.9-9.7c1.9 1.8 4.4 2.9 7.2 2.9 5.9 0 10.6-4.8 10.6-10.6 0-5.9-4.8-10.6-10.6-10.6-5.9 0-10.6 4.8-10.6 10.6 0 .6 0 1.1.1 1.7l-20.3 9.8c-1.8-1.6-4.2-2.5-6.8-2.5-5.9 0-10.6 4.8-10.6 10.6s4.8 10.6 10.6 10.6c2.6 0 5-.9 6.8-2.5L57 66.3c-.1.5-.1 1.1-.1 1.7 0 5.9 4.8 10.6 10.6 10.6 5.9 0 10.6-4.8 10.6-10.6 0-5.9-4.7-10.7-10.6-10.7z"/>
</svg>
<style>
  path {
    fill: currentColor;
  }
</style>