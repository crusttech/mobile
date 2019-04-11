# Crust mobile
Repository contains code used to encapsulate other crust projects inside cordova, so they can run as hybrid mobile apps.

## Build app
Build is done using a container.

### Volumes:
* /c_in
  * Used to provide project as a local file instead of a remote repo.
* /c_out
  * Used to provide a destination for built files.
* /p_in
  * Used to provide a crust webapp, that is used as a cordova dependency.
* /root/.gradle
  * Used by gradle's cache for faster builds. Optional, but recommended.
* /root/.cache/yarn
  * Used by yarn's cache for faster builds. Optional, but recommended

### Setup
1. Build a container used for building cordova apps.
2. Run the container with these available flags:
  * `s`
    * source -- local/remote
  * `l`
    * location -- if source is remote, specify a git repo; if source is local this flag should be omitted.
  * `o`
    * operation -- build/run
    * if run is used; you should specify where your device is mounted with an extra -v flag. Example: `docker run ... -v /dev/bus/usb:/dev/bus/usb ...`
  * `p`
    * platform -- android/ios
    * TODO: Allow both platforms. This will be provided as (order not important): `android ios`

### Example
* Example of build from remote repos:
  * `docker run -it -v /abs/path/out:/c_out -v /abs/path_home/.gradle:/root/.gradle -v /abs/path_home/.cache/yarn:/root/.cache/yarn  builder-image -s remote -l https://github.com/crusttech/mobile-messaging.hybrid.git -o build -p android`

* Example of build from local:
  * `docker run -it -v /abs/path/out:/c_out -v /abs/path/mobile-messaging.hybrid:/c_in -v /abs/path/webapp-messaging:/p_in -v /abs/path_home/.gradle:/root/.gradle -v /abs/path_home/.cache/yarn:/root/.cache/yarn builder-image -s local -o build -p android`

## Makefile
Depricated. Use docker image instead.

## Crust project setup
Used project will have access to `cordova` - grants access to device's api. It will also have a `env.VUE_APP_CORDOVA` variable - used to determine if it is running inside cordova.
