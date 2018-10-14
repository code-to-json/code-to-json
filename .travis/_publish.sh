#!/bin/bash
echo "git status"
git status
echo "lerna publish"
./node_modules/.bin/lerna publish --conventional-commits --message "chore: update changelogs [skip-ci]" --yes