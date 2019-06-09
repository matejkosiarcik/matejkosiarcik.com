# This Makefile does not contain any build steps
# It only groups helper scripts for use

# setup
MAKEFLAGS += --warn-undefined-variables
FORCE:

## Installing dependencies ##

bootstrap: FORCE
	npm install

## Deploying project ##

deploy: FORCE
	sh '$(PWD)/utils/deploy.sh'
