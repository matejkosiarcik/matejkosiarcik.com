# This Makefile does not contain any build steps
# It only groups scripts to use in project

MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/sh  # for compatibility (mainly with redhat distros)
.SHELLFLAGS := -ec
MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PROJECT_DIR := $(realpath $(dir $(abspath $(MAKEFILE_LIST))))
BUNDLE_ENV := BUNDLE_DISABLE_SHARED_GEMS=true BUNDLE_PATH__SYSTEM=false BUNDLE_PATH="$(PROJECT_DIR)/web/jekyll/.bundle" BUNDLE_GEMFILE=$(PROJECT_DIR)/web/jekyll/Gemfile

.POSIX:

.DEFAULT: all
.PHONY: all
all: bootstrap lint build

.PHONY: bootstrap
bootstrap:
	gem install bundler
	$(BUNDLE_ENV) bundle install
	npm install --prefix $(PROJECT_DIR)/web

.PHONY: lint
lint:
	npm run --prefix $(PROJECT_DIR)/web lint

.PHONY: clean
clean:
	rm -f web/assets/favicon/favicon.png web/assets/favicon/favicon.ico
	$(BUNDLE_ENV) bundle exec rake -f $(PROJECT_DIR)/web/jekyll/Rakefile clean
	npm run --prefix $(PROJECT_DIR)/web clean

.PHONY: build
build:
	$(BUNDLE_ENV) bundle exec rake -f $(PROJECT_DIR)/web/jekyll/Rakefile build
	npm run --prefix $(PROJECT_DIR)/web build

.PHONY: run
run:
	$(BUNDLE_ENV) bundle exec rake -f $(PROJECT_DIR)/web/jekyll/Rakefile prestart
	@$(MAKE) -j2 -C$(PROJECT_DIR) -f$(MAKEFILE_PATH) _run

.PHONY: _run # this target should be invoked with -j2 option to run dependant targets in parallel
_run: run_npm run_rake

.PHONY: run_npm
run_npm:
	npm start --prefix $(PROJECT_DIR)/web

.PHONY: run_rake
run_rake:
	$(BUNDLE_ENV) bundle exec rake -f $(PROJECT_DIR)/web/jekyll/Rakefile start
