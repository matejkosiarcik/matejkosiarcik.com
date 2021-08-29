# This Makefile does not contain any build steps
# It only groups scripts to use in project

MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/sh  # for compatibility (mainly with redhat distros)
.SHELLFLAGS := -ec
PROJECT_DIR := $(realpath $(dir $(abspath $(MAKEFILE_LIST))))
MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
BUNDLE_ENV := BUNDLE_DISABLE_SHARED_GEMS=true BUNDLE_PATH__SYSTEM=false BUNDLE_PATH="$(PROJECT_DIR)/jekyll/.bundle" BUNDLE_GEMFILE=$(PROJECT_DIR)/jekyll/Gemfile

.POSIX:

.DEFAULT: all
.PHONY: all
all: bootstrap build

.PHONY: bootstrap
bootstrap:
	command -v bundle >/dev/null 2>&1 || gem install bundler
	$(BUNDLE_ENV) bundle install
	npm ci
	npm ci --prefix remynify

.PHONY: lint
lint:
	npm run lint

.PHONY: clean
clean:
	rm -f assets/favicon/favicon.png assets/favicon/favicon.ico
	$(BUNDLE_ENV) bundle exec rake -f $(PROJECT_DIR)/jekyll/Rakefile clean
	npm run clean

.PHONY: prebuild
prebuild:
	true

.PHONY: build
build: prebuild
	$(BUNDLE_ENV) bundle exec rake -f $(PROJECT_DIR)/jekyll/Rakefile build
	npm run build

.PHONY: run
run: prebuild
	$(BUNDLE_ENV) bundle exec rake -f $(PROJECT_DIR)/jekyll/Rakefile prestart
	@$(MAKE) -j2 -C$(PROJECT_DIR) -f$(MAKEFILE_PATH) _run

.PHONY: _run # this target should be invoked with -j2 option to run dependant targets in parallel
_run: run_npm run_rake

.PHONY: run_npm
run_npm:
	npm start

.PHONY: run_rake
run_rake:
	$(BUNDLE_ENV) bundle exec rake -f $(PROJECT_DIR)/jekyll/Rakefile start
