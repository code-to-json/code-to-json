#!/bin/bash
npm run test:ci && ./node_modules/.bin/travis-deploy-once "npm run ci:publish"