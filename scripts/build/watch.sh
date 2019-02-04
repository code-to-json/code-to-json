#!/bin/bash
echo "Removing old build"
rm -rf packages/*/lib
echo "Creating initial build"

if yarn build
then
  echo "Setting up watch build"
  ./node_modules/.bin/concurrently \
    -n "utils,utils-ts,utils-node,cli,core,core-linker,comments,formatter,formatter-linker,test-helpers" \
    -c "magenta,cyan,green,yellow,blue,purple,orange,grey,white,brown" \
    "tsc -w --pretty --preserveWatchOutput -p ./packages/utils" \
    "tsc -w --pretty --preserveWatchOutput -p ./packages/utils-ts" \
    "tsc -w --pretty --preserveWatchOutput -p ./packages/utils-node" \
    "tsc -w --pretty --preserveWatchOutput -p ./packages/cli" \
    "tsc -w --pretty --preserveWatchOutput -p ./packages/core" \
    "tsc -w --pretty --preserveWatchOutput -p ./packages/core-linker" \
    "tsc -w --pretty --preserveWatchOutput -p ./packages/comments" \
    "tsc -w --pretty --preserveWatchOutput -p ./packages/formatter" \
    "tsc -w --pretty --preserveWatchOutput -p ./packages/formatter-linker" \
    "tsc -w --pretty --preserveWatchOutput -p ./packages/test-helpers"
else
    echo "Initial build failed"
fi
