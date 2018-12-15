#!/bin/bash

echo "On master branch. Proceeding with publish"
echo "git status"
git status
echo "lerna publish"
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN -q
echo "npm whoami"
npm whoami
git checkout $TRAVIS_BRANCH
echo "git status"
git status
git config credential.helper store
git config --global user.email "michael.l.north@gmail.com"
git config --global user.name "Mike North"
git config --global push.default simple
echo "https://mike-north:${GH_TOKEN}@github.com/mike-north/code-to-json.git" > ~/.git-credentials
echo "git config --list"
git config --list #debug
yarn build
./node_modules/.bin/lerna publish --yes
