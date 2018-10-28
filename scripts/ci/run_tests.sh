#!/bin/bash
echo "=== Code-To-JSON [Run Tests] ==="
if [ "$TRAVIS" != "" ]
then
  ./node_modules/.bin/commitlint-travis && bash ./scripts/test/ci.sh
else
  bash ./scripts/test/ci.sh
fi