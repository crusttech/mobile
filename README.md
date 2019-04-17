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
* /root/.android
  * Used by android build process. Should be provided so android can use cache for faster builds. It's also important so we can persist key chain over multiple build runs.
    * On build, app is signed using the before generated keys. Since container starts from scratch this key gets generated every time, and we get a key miss match when deploy is attempted.

*Above cache directories don't need to be host machine's; you can create an empty directory eg. .android inside this project. gitignore can already filter these out.*

### Setup
1. Build a container used for building cordova apps.
2. Run the container with these available flags:
  * `s`
    * source -- local/remote
  * `l`
    * location -- if source is remote, specify a git repo; if source is local this flag should be omitted.
  * `o`
    * operation -- build/run
    * if run is used, you have to mount the device as well. You cen either use:
      * `--device=` flag and specify the device
      * `--privileged` with volume `-v /dev/bus/usb:/dev/bus/usb`; this will give access to all devices on your host machine.
  * `p`
    * platform -- android/ios
    * TODO: Allow both platforms. This will be provided as (order not important): `android ios`

### Example
If you use the example commands, replace the /abs/path/ and /abs/path_home/ with desired paths.
* Example of build from remote repos:
  * `docker run -it -v /abs/path/out:/c_out -v /abs/path_home/.gradle:/root/.gradle -v /abs/path_home/.cache/yarn:/root/.cache/yarn  builder-image -s remote -l https://github.com/crusttech/mobile-messaging.hybrid.git -o build -p android`

* Example of build from local:
  * `docker run -it -v /abs/path/out:/c_out -v /abs/path/mobile-messaging.hybrid:/c_in -v /abs/path/webapp-messaging:/p_in -v /abs/path_home/.gradle:/root/.gradle -v /abs/path_home/.cache/yarn:/root/.cache/yarn builder-image -s local -o build -p android`

* Example of deploy to device:
  * `docker run -it --privileged -v /dev/bus/usb:/dev/bus/usb -v /abs/path/out:/c_out -v /abs/path/mobile-messaging.hybrid:/c_in -v /abs/path/webapp-messaging:/p_in -v /abs/path_home/.gradle:/root/.gradle -v /abs/path_home/.cache/yarn:/root/.cache/yarn builder-image -s local -o run -p android`

## Makefile
Depricated. Use docker image instead.

## Crust project setup
Used project will have access to `cordova` - grants access to device's api. It will also have a `env.VUE_APP_CORDOVA` variable - used to determine if it is running inside cordova.
