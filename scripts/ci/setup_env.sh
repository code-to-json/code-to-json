#!/bin/bash
echo "=== Code-To-JSON [Setup Env] ==="
source ./scripts/ci/setup_tools.sh
if [ "$TRAVIS" == "true" ]
then 
  echo "Travis-CI Detected!"
  source ./scripts/ci/setup_env/travis.sh
elif [ "$SYSTEM_COLLECTIONID" != "" ]
then
  echo "Azure Pipelines Detected!"
  source ./scripts/ci/setup_env/azure.sh
else
  echo "Default Env Detected!"
  source ./scripts/ci/setup_env/default.sh
fi

if [ "$CI_BRANCH" == "master" ]
then
  export IS_MASTER=true
else
  export IS_MASTER=false
fi

echo "IS_PULL_REQUEST: $IS_PULL_REQUEST"
echo "CI_BRANCH: $CI_BRANCH"
echo "IS_MASTER: $IS_MASTER"