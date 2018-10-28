#!/bin/bash
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, skipping publish"
  exit 0
fi

if [ ( $TRAVIS_BRANCH == 'master' ) -a ( "$TRAVIS_PULL_REQUEST" == "false" ) ]; then
  echo "On master branch. Proceeding with publish"
  echo "git status"
  git status
  echo "lerna publish"
  ./node_modules/.bin/lerna publish --yes
fi
