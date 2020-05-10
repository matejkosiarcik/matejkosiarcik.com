# This Makefile does not contain any build steps
# It only groups scripts to use in project

MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/sh  # for compatibility (mainly with redhat distros)
.SHELLFLAGS := -ec
MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))

.DEFAULT: all
.PHONY: all
all: bootstrap lint test build build-test

.PHONY: unit
unit: bootstrap lint test

.PHONY: bootstrap
bootstrap:
	gem install bundler
	bundle install --gemfile $(CURDIR)/web/jekyll/Gemfile
	npm install --prefix $(CURDIR)/web

.PHONY: lint
lint:
	npm run --prefix web lint

.PHONY: prebuild
prebuild:
	convert -resize 64x64 -density 1000 -background none web/assets/favicon/favicon.svg web/assets/favicon/favicon.png
	convert -define icon:auto-resize=32,16 -background none -colors 256 -density 1000 web/assets/favicon/favicon.png web/assets/favicon/favicon.ico

.PHONY: build
build: prebuild
	BUNDLE_GEMFILE=$(CURDIR)/web/jekyll/Gemfile bundle exec rake -f $(CURDIR)/web/jekyll/Rakefile build
	npm run --prefix $(CURDIR)/web build

.PHONY: clean
clean:
	rm -f web/assets/favicon/favicon.png web/assets/favicon/favicon.ico
	BUNDLE_GEMFILE=$(CURDIR)/web/jekyll/Gemfile bundle exec rake -f $(CURDIR)/web/jekyll/Rakefile clean
	npm run --prefix $(CURDIR)/web clean

.PHONY: prod-serve
prod-serve:
	docker-compose up

.PHONY: run
run: prebuild
	BUNDLE_GEMFILE=$(CURDIR)/web/jekyll/Gemfile bundle exec rake -f $(CURDIR)/web/jekyll/Rakefile prestart
	@$(MAKE) -j2 -C$(CURDIR) -f$(MAKEFILE_PATH) _run

# this target should be invoked with -j2 option to run dependant targets in parallel
.PHONY: _run
_run: run_npm run_rake

.PHONY: run_npm
run_npm:
	npm start --prefix $(CURDIR)/web

.PHONY: run_rake
run_rake:
	BUNDLE_GEMFILE=$(CURDIR)/web/jekyll/Gemfile bundle exec rake -f $(CURDIR)/web/jekyll/Rakefile start
