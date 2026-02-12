#!/bin/bash

# Script to download the latest data.json from GitHub releases

set -e

# GitHub repository with the data
REPO="DigitaleGesellschaft/Datenauskunftsbegehren-Data"
OUTPUT_DIR="${1:-public}"

# Get the latest release information
LATEST_RELEASE=$(curl -L -s -H 'Accept: application/json' "https://github.com/${REPO}/releases/latest")

# Extract the tag_name from the release
LATEST_VERSION=$(echo "$LATEST_RELEASE" | sed -e 's/.*"tag_name":"\([^"]*\)".*/\1/')

if [ -z "$LATEST_VERSION" ]; then
    echo "Error: Could not determine latest version"
    exit 1
fi

echo "Latest version: $LATEST_VERSION"

# Construct the artifact URL
ARTIFACT_URL="https://github.com/${REPO}/releases/download/${LATEST_VERSION}/data.json"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Download the data.json
echo "Downloading data.json from: $ARTIFACT_URL"
curl -L -o "${OUTPUT_DIR}/data.json" "$ARTIFACT_URL"

echo "Successfully downloaded data.json to ${OUTPUT_DIR}/data.json"
