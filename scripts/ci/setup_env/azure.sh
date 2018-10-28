#!/bin/bash
echo "=== Code-To-JSON [Setup-Env: Azure] ==="

if [ "$TRAVIS_PULL_REQUEST" != "false" ]
then
  echo "Travis: PR detected"
  export IS_PULL_REQUEST=true
else
  echo "Travis: Non-PR detected"
  export IS_PULL_REQUEST=false
fi

export CI_BRANCH="$TRAVIS_BRANCH"
