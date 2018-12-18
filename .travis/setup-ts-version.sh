#!/bin/bash
echo "Setting up TS version $1"

./node_modules/.bin/lerna add "typescript@$1" --scope=@code-to-json/core --scope=@code-to-json/utils-ts --scope=@code-to-json/utils-ts --scope=@code-to-json/test-helpers --scope=@code-to-json/cli 
./node_modules/.bin/lerna add -D "typescript@$1" --scope=@code-to-json/utils --scope=@code-to-json/schema --scope=@code-to-json/formatter
lerna bootstrap

echo "Found Versions:"
lerna exec "cat package.json | jq \".name\" && echo '  └ TypeScript $(tsc -v)'" --scope=@code-to-json/* --concurrency 1