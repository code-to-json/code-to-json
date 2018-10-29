#!/bin/bash
echo "=== Code-To-JSON [Run Tests] ==="
echo "IS_PULL_REQUEST=$IS_PULL_REQUEST"
echo "IS_MASTER=$IS_MASTER"
echo "TRAVIS=$TRAVIS"
if [ "$TRAVIS" != "" -a "$IS_PULL_REQUEST" == "false"  -a "$IS_MASTER" == "true" ]
then
    echo "TRAVIS: We are on master. Attempting publish after successful tests"
    npm run test:ci && ./node_modules/.bin/travis-deploy-once .travis/_publish.sh
elif [ "$TRAVIS" != "" -a "$IS_PULL_REQUEST" == "true" -a "$IS_MASTER" == "true" ]
then
    echo "TRAVIS: PR build (master)"
    npm run test:ci
elif [ "$TRAVIS" != "" -a "$IS_PULL_REQUEST" == "false" -a "$IS_MASTER" == "false" ]
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