#!/bin/bash

TAG=$(git describe --abbrev=0 --tags --exact-match HEAD 2>/dev/null)

if [[ -z "$TAG" ]]; then
  echo "No tag found for the current commit. Please provide a Tag to proceed with the Build."
  exit 1
else
  echo "Tag for the current commit: $TAG"
fi
