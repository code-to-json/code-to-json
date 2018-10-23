#!/bin/bash
echo "Removing old build"
rm -rf packages/*/lib
echo "Creating initial build"
tsc -b packages/utils && tsc -b packages/core && tsc -b packages/formatter && tsc -b packages/cli
if [ $? -eq 0 ]; then
  echo "Setting up watch build"
  ./node_modules/.bin/concurrently -n "utils,cli,core,formatter" -c "magenta,cyan,green,yellow" "tsc -w -p ./packages/utils" "tsc -w -p ./packages/cli" "tsc -w -p ./packages/core" "tsc -w -p ./packages/formatter"
else
    echo "Initial build failed"
fi
