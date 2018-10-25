#!/bin/bash
npm install -g codecov
npm run test:ci && ./node_modules/.bin/travis-deploy-once .travis/_publish.sh