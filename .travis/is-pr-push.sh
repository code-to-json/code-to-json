#!/bin/bash
test "$TRAVIS_PULL_REQUEST" != "false" && test "$TRAVIS_BRANCH" = "master"
