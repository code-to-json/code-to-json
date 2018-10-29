#!/bin/bash

echo "On master branch. Proceeding with publish"
echo "git status"
git status
echo "lerna publish"
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN -q
echo "npm whoami"
npm whoami
echo "git status"
git status
./node_modules/.bin/lerna publish --yes
