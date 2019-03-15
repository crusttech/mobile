PROJECT_NAME = crust-project
PROJECT_DIR = ./node_modules/${PROJECT_NAME}/
CORDOVA_ROOT = www/
PROJECT_BUILD_PATH = ../../${CORDOVA_ROOT}
PROJECT_CORDOVA_CRUST_CFG_FILE = config.cordova.js
PROJECT_CRUST_CFG_FILE = config.js
CORDOVA_CONFIG_ROOT = ./config/
VUE_CONFIG_BASE = base.config.js
VUE_CONFIG = vue.config.js

# Refetches crust project; has to be specified inside package.json
refetch:
	yarn install
	yarn upgrade ${PROJECT_NAME}

# Inject reference to cordova's generated script
inject.ref:
	echo "<script src=cordova.js></script>" >> ${PROJECT_DIR}public/index.html

## Cordova config file
cordova.config:
	cp ${PROJECT_DIR}public/${PROJECT_CORDOVA_CRUST_CFG_FILE} ${PROJECT_DIR}public/${PROJECT_CRUST_CFG_FILE}

## Env config file
env.config:
	cp -r ${CORDOVA_CONFIG_ROOT}env/. ${PROJECT_DIR}

vue.config:
	mv ${PROJECT_DIR}${VUE_CONFIG} ${PROJECT_DIR}${VUE_CONFIG_BASE}
	cp ${CORDOVA_CONFIG_ROOT}${VUE_CONFIG} ${PROJECT_DIR}${VUE_CONFIG}

# Updates configs
configure: cordova.config env.config vue.config


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
	cp ${PROJECT_DIR}public/config.js ./${CORDOVA_ROOT}

# Runs app
run:
	cordova run android

# Builds app
build.android:
	cordova build android


deploy: refetch inject.ref configure build populate run
app: refetch inject.ref configure build populate build.android
platforms:
	cordova platform add android
	# cordova platform add ios
