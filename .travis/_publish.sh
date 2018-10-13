#!/bin/bash
echo "git status"
git status
echo "lerna publish"
lerna publish from-git --message \"chore: update changelogs [skip-ci]\" --yes