#!/bin/bash
echo "Removing old build"
rm -rf packages/*/lib
echo "Creating initial build"
tsc -b packages/utils && tsc -b packages/core && tsc -b packages/formatter && tsc -b packages/cli && tsc -b packages/test-helpers
if [ $? -eq 0 ]; then
  echo "Setting up watch build"
  ./node_modules/.bin/concurrently \
    -n "utils,cli,core,formatter,test-helpers" \
    -c "magenta,cyan,green,yellow,orange" \
    "tsc -w -p ./packages/utils" \
    "tsc -w -p ./packages/cli" \
    "tsc -w -p ./packages/core" \
    "tsc -w -p ./packages/formatter" \
    "tsc -w -p ./packages/test-helpers"
else
    echo "Initial build failed"
fi
