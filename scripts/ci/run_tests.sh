#!/bin/bash
echo "=== Code-To-JSON [Run Tests] ==="
if [ "$TRAVIS" != "" -a "$TRAVIS_PULL_REQUEST" == "false"  -a "$TRAVIS_BRANCH" == "master" ]
then
    echo "We are on master. Attempting publish after successful tests"
    npm run test:ci && ./node_modules/.bin/travis-deploy-once .travis/_publish.sh
elif [ ( "$TRAVIS" != "" ) ]
    echo "Non master, non-pr build"
    npm run test:ci
else
  bash ./scripts/test/ci.sh
fi