# setup
MAKEFLAGS += --warn-undefined-variables
FORCE:

## Installing dependencies ##

bootstrap: FORCE
	cd 'web' && npm install --save --save-dev
	cd 'tests' && npm install --save --save-dev
	if [ "$(shell uname)" == "Darwin" ]; then brew bundle; fi

update: FORCE
	cd 'web' && npm update --save --save-dev
	cd 'tests' && npm update --save --save-dev
	if [ "$(shell uname)" == "Darwin" ]; then brew bundle; fi

clean: FORCE
	cd 'web' && npm run clean

## Running ##

run: FORCE
	make watch & make serve

serve: FORCE
	docker run -p 80:80 -p 443:443 --rm --name apache -v '$(PWD)/web/build:/app' bitnami/apache:latest

## Building ##

build: FORCE
	cd 'web' && npm run build

watch: FORCE
	cd 'web' && npm run watch

dist: FORCE
	cd 'web' && npm run dist
