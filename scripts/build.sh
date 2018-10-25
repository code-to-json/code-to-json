#!/bin/bash
./node_modules/.bin/lerna link
tsc -b packages/schema && tsc -b packages/utils && tsc -b packages/core && tsc -b packages/formatter && tsc -b packages/cli
