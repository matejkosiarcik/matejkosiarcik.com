# This Makefile does not contain any build steps
# It only groups scripts to use in project

# setup
MAKEFLAGS += --warn-undefined-variables
FORCE:

## Installing dependencies ##

bootstrap: FORCE
	npm install --save --save-dev
	cd 'tests' && npm install --save --save-dev
	if [ "$(shell uname)" == "Darwin" ]; then brew bundle; fi

update: FORCE
	npm update --save --save-dev
	cd 'tests' && npm update --save --save-dev
	if [ "$(shell uname)" == "Darwin" ]; then brew bundle; fi

clean: FORCE
	npm run clean

## Running ##

run: FORCE
	make watch & make serve

serve: FORCE
	docker run -p 80:80 -p 443:443 --rm --name apache -v '$(PWD)/build:/app' bitnami/apache:latest

## Building ##

build: FORCE
	npm run build

watch: FORCE
	npm run watch

dist: FORCE
	npm run dist
