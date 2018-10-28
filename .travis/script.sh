#!/bin/bash
npm install -g codecov
if [ "$TRAVIS_PULL_REQUEST" != "false" ]
then
  echo "We are in a pull request (PR $TRAVIS_PULL_REQUEST), not setting up release"
  npm run test:ci
elif if [ "$TRAVIS_BRANCH" == "master" ]
then
  echo "We are on master. Attempting publish after successful tests"
  npm run test:ci 
  #&& ./node_modules/.bin/travis-deploy-once .travis/_publish.sh
else 
  echo "Non master, non-pr build"
fi