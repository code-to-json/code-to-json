#!/bin/bash
lerna clean --yes
rm -rf packages/*/lib
rm -rf packages/*/.nyc_output
rm -rf packages/*/coverage