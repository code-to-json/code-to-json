#!/bin/bash
npm run test:ci && ./node_modules/.bin/travis-deploy-once .travis/_publish.sh