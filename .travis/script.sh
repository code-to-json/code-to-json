#!/bin/bash
if [ ( "$TRAVIS_PULL_REQUEST" == "false" ) -a ( "$TRAVIS_BRANCH" == "master" ) ]
then
  echo "We are on master. Attempting publish after successful tests"
  npm run test:ci && ./node_modules/.bin/travis-deploy-once .travis/_publish.sh
else 
  echo "Non master, non-pr build"
  npm run test:ci
fi