PROJECT_NAME = crust-project
PROJECT_DIR = ./node_modules/${PROJECT_NAME}/
CORDOVA_APP_ROOT = www/
PROJECT_BUILD_PATH = ../../${CORDOVA_APP_ROOT} # Directory inside cordova root
CORDOVA_CFG_FILE = config.cordova.js
PROJECT_CFG_FILE = config.js
CORDOVA_ENV_DIR = ./env/

# Refetches crust project; has to be specified inside package.json
refetch:
	yarn install
	yarn upgrade ${PROJECT_NAME}


## Cordova config file
cordova.config:
	cp ${PROJECT_DIR}public/${CORDOVA_CFG_FILE} ${PROJECT_DIR}public/${PROJECT_CFG_FILE}

## Env config file
env.config:
	cp -r ${CORDOVA_ENV_DIR}. ${PROJECT_DIR}

# Updates configs
configure: cordova.config env.config


## Update project's dependencies
project.dependencies:
	yarn --cwd ${PROJECT_DIR} install

## Build project
project.build:
	yarn --cwd ${PROJECT_DIR} build --dest ${PROJECT_BUILD_PATH}

# Builds project
build: project.dependencies project.build

# Populates cordova's source with aditional configs
populate:
	cp ${PROJECT_DIR}public/config.js ./${CORDOVA_APP_ROOT}

# Runs app
run:
	cordova run android

# Builds app
build.android:
	cordova build android


deploy: refetch configure build populate run
app: refetch configure build populate build.android
