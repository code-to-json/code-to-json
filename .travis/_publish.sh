#!/bin/bash
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, skipping publish"
  exit 0
fi

if [[ $TRAVIS_BRANCH == 'master' ]]; then
  echo "On master branch. Proceeding with publish"
  echo "git status"
  git status
  echo "lerna publish"
  ./node_modules/.bin/lerna publish --conventional-commits
fi
