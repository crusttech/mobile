#!/bin/bash

# ANDROID_HOME is deprecated
export ANDROID_SDK_ROOT="$ANDROID_HOME" && unset ANDROID_HOME;

# Exit if any section fails
set -e
trap 'lc=$cc; cc=$BASH_COMMAND' DEBUG
trap '
if [ $? -gt 0 ]; then
  echo "command \"${lc}\" failed; exit code $?.";
fi' EXIT

# globals
CORDOVA_IN="/cordova-in";
CORDOVA_OUT="/cordova-out";
CORTEZA_AUTH="/corteza-webapp-auth";
CORTEZA_MESSAGING="/corteza-webapp-messaging";
CRUST_MESSAGING="/crust-webapp-messaging";

CORDOVA_SRC="./src-cordova";
ANDROID_RESOURCE_ROOT="./platforms/android/app/src/main/res/";

cd "$CORDOVA_IN";
echo pwd;

# get flags
source='';
location='';
operation='';
platforms='android';
release=false;
versionAndroid='8.0.0';
versionIos='';

printf "* extract flags";
while getopts 's:l:o:p:va:vi:r' flag; do
  case "${flag}" in
    s) source="${OPTARG}" ;;
    l) location="${OPTARG}" ;;
    o) operation="${OPTARG}" ;;
    p) platforms="${OPTARG}" ;;
    r) release=true ;;
    va) versionAndroid="${OPTARG}" ;;
    vi) versionIos="${OPTARG}" ;;
    *) echo "Invalid arg"; exit 1 ;;
  esac
done
printf " ... done\n";

# get project
printf "* get project";
case "$source" in
  local|l)
    printf " ... using local project";;

  remote|r)
    printf " ... using remote project $location";
    git clone "$location" "$CORDOVA_IN" ;;

  *) echo "Invalid source: $source"; exit 1 ;;
esac
printf " ... done\n";

# update deps
printf "* update deps";
yarn;
printf " ... done\n";

# build project
printf "* uild project";
yarn cordova-build-only-www-android;
printf " ... done\n";

# copy config
printf "* copy config";
cp "public/config.js" "$CORDOVA_SRC/www/config.js";
printf " ... done\n";

# add platform
printf "* add platforms\n";
cd "$CORDOVA_SRC";
for platform in $platforms; do
  echo "  * $platform";
  if [[ $platform == 'android' ]]; then
    if ! [[ -d "platforms/android" ]]; then
      echo "@$versionAndroid\n";
      cordova platform add "$platform@$versionAndroid";
    fi
  elif [[ $platform == 'ios' ]]; then
    cordova platform add "$platform@$versionIos";
    echo "@$versionIos\n";
  else
    echo "Invalid platform: $platform"; exit 1;
  fi
done
printf " ... done\n";

# copy app assets
printf "* coppy app assets";
cp -r "./res/icon/android/." "${ANDROID_RESOURCE_ROOT}";
cp -r "./res/screen/android/." "${ANDROID_RESOURCE_ROOT}";
cp -r "./res/values/android/." "${ANDROID_RESOURCE_ROOT}/values";
printf " ... done\n";

# run operation
printf "* run operation";
case "$operation" in
  build|b)
    # @todo Support for iOS
    printf " ... building android";

    if [ "$release" = true ]; then
      printf " ... release";
      cordova build "$platforms" --release --buildConfig;
      cp "./platforms/android/app/build/outputs/apk/release/*" "$C_OUT/";

    else
      printf " ... debug";
      cordova build "$platforms" --debug;
      cp "./platforms/android/app/build/outputs/apk/debug/*" "$C_OUT/";

    fi ;;

  run|r)
    echo " ... running $platform";
    cordova run  "$platform" --debug ;;

  *) echo "Invalid operation: $operation"; exit 1 ;;
esac

printf " ... done\n";
exit 0;
