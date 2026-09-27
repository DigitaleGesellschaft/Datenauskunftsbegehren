#!/usr/bin/env bash
set -euo pipefail

CMD="${1:-}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

CURRENT_USER="$(id -u):$(id -g)"
NODE_USER_ARGS=(--user "${CURRENT_USER}" -e HOME=/tmp)
GIT_REVISION=$(git -C "${PROJECT_ROOT}" rev-parse --short HEAD 2>/dev/null || echo 'unknown')

NODE_IMAGE="node:26-alpine"
# Debian based image for commands that need bash or git.
NODE_IMAGE_DEBIAN="node:26"

run_node() {
  docker run --rm \
    "${NODE_USER_ARGS[@]}" \
    -v "${PROJECT_ROOT}:/app" \
    -w /app \
    -e GIT_REVISION="${GIT_REVISION}" \
    "$@"
}

case "$CMD" in
  dev)
    run_node -it --network host -e VITE_TEST_BANNER=true "${NODE_IMAGE}" \
      sh -c "npm install && npm run dev"
    ;;
  test)
    PLAYWRIGHT_VERSION=$(run_node "${NODE_IMAGE}" \
      node -e "const p=require('./package.json');console.log(p.devDependencies['@playwright/test'].replace(/[\^~]/,''))")
    EXTRA_ARGS=("${@:2}")
    docker run --rm -i \
      "${NODE_USER_ARGS[@]}" \
      -v "${PROJECT_ROOT}:/app" \
      -w /app \
      --network host \
      -e GIT_REVISION="${GIT_REVISION}" \
      "mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble" \
      bash -c "npm install && npm run dev &
               VITE_TEST_BANNER=true npx vite --port 5174 &
               while ! (echo > /dev/tcp/localhost/5173) 2>/dev/null; do sleep 0.5; done
               while ! (echo > /dev/tcp/localhost/5174) 2>/dev/null; do sleep 0.5; done
               npx playwright test -c ./playwright.config.ts \"\$@\"" bash "${EXTRA_ARGS[@]}"
    ;;
  download-data)
    run_node "${NODE_IMAGE}" \
      sh -c "wget -O public/data_de.json https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data/releases/latest/download/data_de.json && \
             wget -O public/data_fr.json https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data/releases/latest/download/data_fr.json"
    ;;
  build)
    run_node "${NODE_IMAGE}" sh -c "npm install && npm run build"
    ;;
  check)
    run_node "${NODE_IMAGE}" sh -c "npm install && npm run check"
    ;;
  preview)
    # Serves the production build (like CI) on http://localhost:8080.
    run_node -it --network host "${NODE_IMAGE}" sh -c "npm install && npm run build && npm run preview"
    ;;
  i18n)
    # The Debian image is used instead of alpine because the i18n shell scripts
    # require bash.
    run_node "${NODE_IMAGE_DEBIAN}" bash -c "npm install && npm run i18n"
    ;;
  i18n-check)
    # git is required because the check compares the extracted locale files
    # against the committed state.
    run_node "${NODE_IMAGE_DEBIAN}" \
      bash -c "git config --global --add safe.directory /app && npm install && npm run i18n-check"
    ;;
  *)
    echo "Usage: $0 {dev|test|build|check|preview|download-data|i18n|i18n-check}"
    exit 1
    ;;
esac
