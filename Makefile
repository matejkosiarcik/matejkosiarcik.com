# This Makefile does not contain any build steps
# It only groups helper scripts for use

# setup
MAKEFLAGS += --warn-undefined-variables
FORCE:

## Installing dependencies ##

pre-bootstrap: FORCE
	if [ '$(shell uname)' == 'Darwin' ]; then brew bundle; fi

bootstrap: pre-bootstrap
	npm install

update: pre-bootstrap
	npm update

## Running server ##

run: FORCE
	make build
	make watch & make serve

serve: FORCE
	docker run -p 80:80 -p 443:443 --rm --name apache -v '$(PWD)/build:/app' bitnami/apache:latest

## Building project ##

build: FORCE
	npm run build

watch: FORCE
	npm run watch

dist: FORCE
	npm run dist

clean: FORCE
	npm run clean

## Deploying project ##

deploy: FORCE
	sh '$(PWD)/utils/deploy.sh'
