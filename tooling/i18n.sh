#!/usr/bin/env bash
# Extract translation keys from UI components into all locale files.
# Only adds missing keys — existing translations are preserved.
#
# src/letter/ is excluded: letter translations live in de-CH.letter.json and
# fr-CH.letter.json and are maintained manually.
#
# If new src subdirectories are added, extend UI_GLOBS below.
set -euo pipefail

# Always run from the project root, regardless of where the script is called from.
cd "$(dirname "$0")/.."

UI_LOCALES=(
  src/locales/de-CH.json
  src/locales/fr-CH.json
  src/locales/en.json
  src/locales/it-CH.json
)

# Directories to scan — letter/ is intentionally excluded.
UI_GLOBS=(
  "src/*.svelte"
  "src/entry/**/*.svelte"
  "src/form/**/*.svelte"
  "src/icons/**/*.svelte"
)

for locale in "${UI_LOCALES[@]}"; do
  for glob in "${UI_GLOBS[@]}"; do
    npx svelte-i18n extract "$glob" "$locale"
  done
  echo "Updated $locale"
done
