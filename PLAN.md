# Adding translations

- current language in code for frontend: de
- new languages to add: fr
- library used: svelte18n

# TODO

- DONE: setup javascript files to use sveltei18n
- identify all german strings in each svelte file
- wrap identified strings in translation identifier, use the current string as default, add sveltei18n to script import
- Add section to README.md how to generate and update translations
- Make recommendations in README.md for programs that can deal with translation string formats
- Use $_ as identifier
- Fix the head tag inside index.html
    ``` 
    <svelte:head>
      <title>{$_('meta.title')}</title>
      <meta name="description" content={$_('meta.description')} />
      <meta property="og:title" content={$_('meta.og_title')} />
      <meta property="og:description" content={$_('meta.og_description')} />
    </svelte:head>
    ```

## References

- https://raw.githubusercontent.com/kaisermann/svelte-i18n/refs/heads/main/docs/Getting%20Started.md
- https://raw.githubusercontent.com/kaisermann/svelte-i18n/refs/heads/main/docs/Formatting.md

