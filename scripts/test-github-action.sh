#!/bin/bash

# This script tests the GitHub Action locally using act
# Install act: https://github.com/nektos/act

echo "Testing GitHub Action locally..."

# Check if act is installed
if ! command -v act &> /dev/null; then
    echo "Error: 'act' is not installed."
    echo "Install it from: https://github.com/nektos/act"
    exit 1
fi

# Run the workflow locally
act -j test \
  --secret GITHUB_TOKEN="dummy-token" \
  --platform ubuntu-latest=node:18

echo "Done!"