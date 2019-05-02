# This Makefile does not contain any build steps
# It only groups helper scripts for use

# setup
MAKEFLAGS += --warn-undefined-variables
FORCE:

## Installing dependencies ##

pre-dependencies: FORCE
	if [ '$(shell uname)' == 'Darwin' ]; then brew bundle; fi

bootstrap: pre-dependencies
	npm install

update: pre-dependencies
	npm update

## Deploying project ##

deploy: FORCE
	sh '$(PWD)/utils/deploy.sh'
