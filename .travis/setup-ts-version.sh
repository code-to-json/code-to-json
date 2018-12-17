#!/bin/bash
echo "TS dependency found"

./node_modules/.bin/lerna add "typescript@$1" --scope=@code-to-json/core --scope=@code-to-json/utils-ts --scope=@code-to-json/utils-ts --scope=@code-to-json/test-helpers --scope=@code-to-json/cli 
./node_modules/.bin/lerna add -D "typescript@$1" --scope=@code-to-json/utils --scope=@code-to-json/schema --scope=@code-to-json/formatter