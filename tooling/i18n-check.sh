#!/usr/bin/env bash
# CI check: verify locale files are complete and up to date.
#
# Fails if:
#   - locale files are out of sync with the code (npm run i18n was not committed)
#   - any non-German locale has untranslated (empty) keys
set -euo pipefail

cd "$(dirname "$0")/.."

# Step 1: Run extraction and check for uncommitted changes
./tooling/i18n.sh

if ! git diff --exit-code src/locales/de-CH.json src/locales/fr-CH.json src/locales/en.json src/locales/it-CH.json > /dev/null 2>&1; then
  echo ""
  echo "ERROR: Locale files are out of sync with the source code."
  echo "Run 'npm run i18n' locally and commit the updated locale files."
  echo ""
  git diff src/locales/
  exit 1
fi

echo "Locale files are up to date."

# Step 2: Check for empty translation values in non-German locales
# (de-CH.json is the source language — defaults come from the code itself)
FAILED=0
for locale in src/locales/fr-CH.json src/locales/en.json src/locales/it-CH.json; do
  EMPTY=$(node --input-type=module <<EOF
import { readFileSync } from 'fs';
const data = JSON.parse(readFileSync('$locale', 'utf8'));
function find(obj, path) {
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? path + '.' + k : k;
    if (v !== null && typeof v === 'object') find(v, p);
    else if (v === '') console.log(p);
  }
}
find(data, '');
EOF
)
  if [ -n "$EMPTY" ]; then
    echo ""
    echo "ERROR: Untranslated keys in $locale:"
    echo "$EMPTY" | sed 's/^/  - /'
    FAILED=1
  fi
done

if [ $FAILED -eq 1 ]; then
  echo ""
  echo "ERROR: Missing translations found. Translate the empty keys above."
  exit 1
fi

echo "All translations are complete."
