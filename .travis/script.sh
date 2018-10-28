#!/bin/bash
npm install -g codecov
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, not setting up release"
  npm run test:ci
else
  echo "We are on master. Attempting publish after successful tests"
  npm run test:ci && ./node_modules/.bin/travis-deploy-once .travis/_publish.sh
fi