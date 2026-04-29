#!/usr/bin/env bash
set -euo pipefail

CMD="${1:-}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

case "$CMD" in
  dev)
    GIT_REVISION=$(git -C "${PROJECT_ROOT}" rev-parse --short HEAD 2>/dev/null || echo 'unknown')
    docker run --rm -it \
      --network host \
      -v "${PROJECT_ROOT}:/app" \
      -e VITE_TEST_BANNER=true \
      -e GIT_REVISION="${GIT_REVISION}" \
      -w /app \
      node:24-alpine \
      sh -c "npm install && npm run dev"
    ;;
  test)
    GIT_REVISION=$(git -C "${PROJECT_ROOT}" rev-parse --short HEAD 2>/dev/null || echo 'unknown')
    PLAYWRIGHT_VERSION=$(docker run --rm -v "${PROJECT_ROOT}:/app" -w /app node:24-alpine \
      node -e "const p=require('./package.json');console.log(p.devDependencies['@playwright/test'].replace(/[\^~]/,''))")
    EXTRA_ARGS="${@:2}"
    docker run --rm -i \
      -v "${PROJECT_ROOT}:/app" \
      -w /app \
      --network host \
      -e GIT_REVISION="${GIT_REVISION}" \
      "mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble" \
      bash -c "npm install && npm run dev &
               VITE_TEST_BANNER=true npx vite --port 5174 &
               while ! (echo > /dev/tcp/localhost/5173) 2>/dev/null; do sleep 0.5; done
               while ! (echo > /dev/tcp/localhost/5174) 2>/dev/null; do sleep 0.5; done
               npx playwright test -c ./playwright.config.ts ${EXTRA_ARGS}"
    ;;
  download-data)
    docker run --rm \
      -v "${PROJECT_ROOT}:/app" \
      -w /app \
      node:24-alpine \
      sh -c "wget -O public/data_de.json https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data/releases/latest/download/data_de.json && \
             wget -O public/data_fr.json https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data/releases/latest/download/data_fr.json"
    ;;
  *)
    echo "Usage: $0 {dev|test|download-data}"
    exit 1
    ;;
esac
