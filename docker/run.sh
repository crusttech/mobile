#!/bin/bash

# Exit if any section fails
set -e
trap 'lc=$cc; cc=$BASH_COMMAND' DEBUG
trap '
if [ $? -gt 0 ]; then
  echo "command \"${lc}\" failed; exit code $?.";
fi' EXIT

PROJECT_NAME="crust-project";
BUILDER_PROJECT_ROOT="/builder/src";
PROJECT_DIR="./node_modules/${PROJECT_NAME}/";
CORDOVA_ROOT="www/";
PROJECT_BUILD_PATH="../../${CORDOVA_ROOT}";
PROJECT_CRUST_CFG_FILE="config.js";
CORDOVA_CONFIG_ROOT="./config/";
VUE_CONFIG_BASE="base.config.js";
VUE_CONFIG="vue.config.js";
VUE_MAIN_BASE="base.main.js";
VUE_MAIN="main.js";

ANDROID_RESOURCE_ROOT="./platforms/android/app/src/main/res/";

C_IN="/c_in";
P_IN="/p_in";
C_OUT="/c_out";

# 1. Collect build options...
source='';
location='';
operation='';
platforms='android';
versionAndroid='8.0.0';
versionIos='';

printf "\n\n...Flags extracting...\n\n";
while getopts 's:l:o:p:va:vi:' flag; do
  case "${flag}" in
    s) source="${OPTARG}" ;;
    l) location="${OPTARG}" ;;
    o) operation="${OPTARG}" ;;
    p) platforms="${OPTARG}" ;;
    va) versionAndroid="${OPTARG}" ;;
    vi) versionIos="${OPTARG}" ;;
    *) echo "Invalid arg"; exit 1 ;;
  esac
done
printf "\n\n...Flags extracted...\n\n";

# 2. Prepare project & dependencies
printf "\n\n...Source extracting...\n\n";
case "$source" in
  local|l)
    cp -r "$C_IN" "$BUILDER_PROJECT_ROOT" ;;
  remote|r)
    git clone "$location" "$BUILDER_PROJECT_ROOT" ;;

  *) echo "Invalid source: $source"; exit 1 ;;
esac
printf "\n\n...Source extracted...\n\n";

# 3. Build process starts...
cd "$BUILDER_PROJECT_ROOT";
mkdir www;

## Prepare cordova & crust app
printf "\n\n...Platforms adding...\n\n"
for platform in $platforms; do
  echo "Adding platform: $platform";
  if [[ $platform == 'android' ]]; then
    cordova platform add "$platform@$versionAndroid";
  elif [[ $platform == 'ios' ]]; then
    cordova platform add "$platform@$versionIos";
  else
    echo "Invalid platform: $platform"; exit 1;
  fi
done
printf "\n\n...Platforms added...\n\n";

## Upgrade crust project dependency
printf "\n\n...Deps upgradeing...\n\n";
yarn install;
yarn upgrade "${PROJECT_NAME}";
printf "\n\n...Deps upgraded...\n\n";

printf "\n\n...Configuring...\n\n";
## Inject custom scripts
# cp scripts/index.js "${PROJECT_DIR}public/scripts.js";

echo "<script src=cordova.js></script>" >> "${PROJECT_DIR}public/index.html";
# echo "<script src=scripts.js></script>" >> "${PROJECT_DIR}public/index.html";

## Clear out crust config file, since mobile client configures it self.
# echo "" > "${PROJECT_DIR}public/${PROJECT_CRUST_CFG_FILE}";

## env configs
cp -r "${CORDOVA_CONFIG_ROOT}env/." "${PROJECT_DIR}";

## Vue configs
mv "${PROJECT_DIR}${VUE_CONFIG}" "${PROJECT_DIR}${VUE_CONFIG_BASE}";
cp "${CORDOVA_CONFIG_ROOT}${VUE_CONFIG}" "${PROJECT_DIR}${VUE_CONFIG}";

## Main
# mv ${PROJECT_DIR}src/${VUE_MAIN} ${PROJECT_DIR}src/${VUE_MAIN_BASE};
# cp ${CORDOVA_CONFIG_ROOT}${VUE_MAIN} ${PROJECT_DIR}src/${VUE_MAIN};

# Aditional resources
cp -r ./res/icon/android/. "${ANDROID_RESOURCE_ROOT}";
cp -r ./res/screen/android/. "${ANDROID_RESOURCE_ROOT}";
printf "\n\n...Configured...\n\n"

# Build vue app
printf "\n\n...Building...\n\n";
yarn --cwd "${PROJECT_DIR}" install;
yarn --cwd "${PROJECT_DIR}" build --dest "${PROJECT_BUILD_PATH}";
cp "${PROJECT_DIR}public/config.js" "./${CORDOVA_ROOT}";
printf "\n\n...Built...\n\n";

# 4. Run/Deploy
printf "\n\n...Operation running...\n\n";
case "$operation" in
  # Local files get coppied to pwd
  build|b)
    # TODO: Support for iOS
    echo "Building for: $platforms";
    cordova build "$platforms" --debug;
    cp platforms/android/build/outputs/apk/android-debug.apk "$C_OUT"/android-debug.apk ;;

  run|r)
    # TODO: Support for iOS
    echo "Running for: $platform";
    cordova run  "$platform" --debug ;;

  *) echo "Invalid operation: $operation"; exit 1 ;;
esac
printf "\n\n...Operation ran...\n\n";
exit 0
