#!/bin/bash
echo "Removing old build"
rm -rf packages/*/lib
echo "Creating initial build"

if yarn build
then
  echo "Setting up watch build"
  ./node_modules/.bin/concurrently \
    -n "utils,cli,core,formatter,test-helpers" \
    -c "magenta,cyan,green,yellow,blue,purple,orange" \
    "tsc -w -p ./packages/utils" \
    "tsc -w -p ./packages/utils-ts" \
    "tsc -w -p ./packages/utils-node" \
    "tsc -w -p ./packages/cli" \
    "tsc -w -p ./packages/core" \
    "tsc -w -p ./packages/formatter" \
    "tsc -w -p ./packages/test-helpers"
else
    echo "Initial build failed"
fi
