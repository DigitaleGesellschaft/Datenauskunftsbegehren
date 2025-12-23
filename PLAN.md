# Adding translations

- current language in code for frontend: de
- new languages to add: fr
- library used: svelte18n
- Do not add anything to locales/*.json, it will be generated

# TODO

- identify all german strings in each svelte file
- wrap identified strings in translation identifier, use the current string as default, add sveltei18n to script import
- Add section to README.md how to generate and update translations
- Make recommendations in README.md for programs that can deal with translation string formats
- Use $_ as identifier
