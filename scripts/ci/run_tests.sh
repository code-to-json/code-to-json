#!/bin/bash
echo "=== Code-To-JSON [Run Tests] ==="
if [ "$TRAVIS" != "" ]
then
  ./node_modules/.bin/commitlint-travis && npm run test:ci
else
  npm run test:ci
fi