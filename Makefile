# This Makefile does not contain any build steps
# It only groups helper scripts for use

# setup
MAKEFLAGS += --warn-undefined-variables
FORCE:

## Installing dependencies ##

pre-bootstrap: FORCE
	if [ "$(shell uname)" == "Darwin" ]; then brew bundle; fi

bootstrap: FORCE
	npm install
	cd 'tests' && npm install

update: pre-bootstrap
	npm update
	cd 'tests' && npm update

clean: FORCE
	rm -rf 'build'

## Running server ##

run: FORCE
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

## Testing project ##

test-local: FORCE
	cd 'tests' && npm run test:local

test-staging: FORCE
	cd 'tests' && npm run test:staging

test-production: FORCE
	cd 'tests' && npm run test-production
