#!/bin/bash

echo "On master branch. Proceeding with publish"

rm -rf .git
git init
git clean -dfx
git remote add origin https://github.com/mike-north/code-to-json.git
git fetch origin
git checkout $TRAVIS_BRANCH

echo "git status"
git status

echo "lerna publish"
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN -q
npm prune

echo "npm whoami"
npm whoami

echo "git status"
git status
git config credential.helper store
git config --global user.email "michael.l.north@gmail.com"
git config --global user.name "Mike North"
git config --global push.default simple
echo "https://mike-north:${GH_TOKEN}@github.com/mike-north/code-to-json.git" > ~/.git-credentials
echo "git config --list"
git config --list #debug
npm run build
./node_modules/.bin/lerna publish --yes
