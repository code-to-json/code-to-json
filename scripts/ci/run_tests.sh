#!/bin/bash
echo "=== Code-To-JSON [Run Tests] ==="
echo "IS_PULL_REQUEST=$IS_PULL_REQUEST"
echo "IS_MASTER=$IS_MASTER"
echo "TRAVIS=$TRAVIS"
echo "TRAVIS_BRANCH=$TRAVIS_BRANCH"
echo "TRAVIS_PULL_REQUEST=$TRAVIS_PULL_REQUEST"
if [ "$TRAVIS" != "" -a "$TRAVIS_PULL_REQUEST" == "false"  -a "$TRAVIS_BRANCH" == "master" ]
then
    echo "TRAVIS: We are on master. Attempting publish after successful tests"
    npm run test:ci && ./node_modules/.bin/travis-deploy-once .travis/_publish.sh
elif [ "$TRAVIS" != "" -a "$TRAVIS_PULL_REQUEST" != "false" -a "$TRAVIS_BRANCH" == "master" ]
then
    echo "TRAVIS: PR build (master)"
    npm run test:ci
elif [ "$TRAVIS" != "" -a "$TRAVIS_BRANCH" != "master" ]
then
    echo "TRAVIS: PR build (branch)"
    npm run test:ci
elif [ "$TRAVIS" != "" ]
then
    echo "TRAVIS: (other build)"
    npm run test:ci
else
    echo "NON-TRAVIS: Non master, non-pr build"
  bash ./scripts/test/ci.sh
fi