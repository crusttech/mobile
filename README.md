# Crust mobile
Repository contains code used to encapsulate other crust projects inside cordova, so they can run as hybrid mobile apps.

## Setup
___
Required cordova setup.
___

* Clone repository
* install dependencies
* specify what project to use inside `package.json`
* run with `make deploy`; build with `make app`

___
* `make deploy` will run the built app directly on your connected device (or virtual device if it is running & no external device is available)
* `make app` will build and output a install file; install file available inside `{project-path}/platforms/{platform}/app/build/outputs/apk/debug/`

// @todo: Currently only android supported; add support for iOS
___

## makefile commands
___
For a full list of commands see `makefile`
___

### make app
Command will:
* Fetch updates for the given crust project
* Manage configuration for the project
* Build the project & prepare it to be ran
* Build a cordova app

## Crust project setup
Used project will have access to `cordova` - grants access to device's api. It will also have a `env.VUE_APP_CORDOVA` variable - used to determine if it is running inside cordova.

Used project should specify:
* `src/router.js > mode` to `hash`
* `vue.config.js > baseUrl` to `''`
