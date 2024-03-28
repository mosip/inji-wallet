#!/bin/bash

flavor="$1"

if [[ "$flavor" == "residentapp" ]]; then
  echo "CLIENT_NAME=INJI_GOOGLE_CLIENT_ID" >> $GITHUB_OUTPUT
elif [[ "$flavor" == "collab" ]]; then
  echo "CLIENT_NAME=COLLAB_ORG_KEY" >> $GITHUB_OUTPUT
elif [[ "$flavor" == "synergy" ]]; then
  echo "CLIENT_NAME=SYNERGY_ORG_KEY" >> $GITHUB_OUTPUT
elif [[ "$flavor" == "inji" ]]; then
  echo "CLIENT_NAME=INJI_ORG_KEY" >> $GITHUB_OUTPUT
elif [[ "$flavor" == "mec" ]]; then
  echo "CLIENT_NAME=MEC_ORG_KEY" >> $GITHUB_OUTPUT
else
  echo "Error: Invalid flavor '$flavor'"
  exit 1
fi