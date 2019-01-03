#!/bin/bash
npm install -g lerna
echo "On master branch. Proceeding with publish"
rm -rf .git
git init
git clean -dfx
git remote add origin https://github.com/code-to-json/code-to-json.git
git fetch origin
git clone "https://github.com/$TRAVIS_REPO_SLUG.git" "$TRAVIS_REPO_SLUG"
git checkout "$TRAVIS_BRANCH"
git config credential.helper store
echo "https://mike-north:${GH_TOKEN}@github.com/mike-north/code-to-json.git" > ~/.git-credentials

npm config set "//registry.npmjs.org/:_authToken=$NPM_TOKEN" -q
npm prune

git config --global user.email "michael.l.north@gmail.com"
git config --global user.name "Mike North"
git config --global push.default simple

git fetch --tags
git branch -u "origin/$TRAVIS_BRANCH"
git fsck --full #debug

echo "npm whoami"
npm whoami
echo "git config --list"
git config --list #debug

echo "lerna publish"
lerna publish --yes
