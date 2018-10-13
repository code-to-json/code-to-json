#!/bin/bash
echo "git status"
git status
echo "lerna publish"
./node_modules/.bin/lerna publish --message \"chore: update changelogs [skip-ci]\"