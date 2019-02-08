#!/bin/bash
echo "Setting up TS version $1"

./node_modules/.bin/lerna add "typescript@$1" --scope=@code-to-json/core --scope=@code-to-json/utils-ts  --scope=@code-to-json/test-helpers --scope=@code-to-json/cli --scope=@code-to-json/core-linker --scope=@code-to-json/formatter-linker
./node_modules/.bin/lerna add -D "typescript@$1" --scope=@code-to-json/utils --scope=@code-to-json/comments --scope=@code-to-json/utils-node --scope=@code-to-json/schema --scope=@code-to-json/formatter
lerna clean --yes && yarn clean && lerna bootstrap && yarn build

echo "Found Versions:"
lerna exec "cat package.json | jq \".name\" && echo '  └ TypeScript $(tsc -v)'" --scope=@code-to-json/* --concurrency 1