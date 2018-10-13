#!/bin/bash
echo "git status"
git status
echo "adding all files for commit"
git add -A
echo "git status"
git status
echo "attempting publish"
./node_modules/.bin/lerna publish --message \"chore: update changelogs [skip-ci]\"