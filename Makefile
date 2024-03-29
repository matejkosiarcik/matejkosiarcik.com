# This Makefile does not contain any build steps
# It only groups scripts to use in project

MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/sh  # for compatibility (mainly with redhat distros)
.SHELLFLAGS := -ec
PROJECT_DIR := $(realpath $(dir $(abspath $(MAKEFILE_LIST))))
BUNDLE_ENV := BUNDLE_DISABLE_SHARED_GEMS=true BUNDLE_PATH__SYSTEM=false BUNDLE_PATH="$(PROJECT_DIR)/jekyll/.bundle" BUNDLE_GEMFILE=$(PROJECT_DIR)/jekyll/Gemfile

.POSIX:

.DEFAULT: all
.PHONY: all
all: bootstrap build

.PHONY: bootstrap
bootstrap:
	npm ci
	@$(MAKE) -C$(PROJECT_DIR)/web bootstrap

.PHONY: lint
lint:
	npm run lint
	@$(MAKE) -C$(PROJECT_DIR)/web lint

.PHONY: fmt
fmt:
	npm run fmt

.PHONY: build
build:
	@$(MAKE) -C$(PROJECT_DIR)/web build

.PHONY: test-prod
test-prod:
	npm ci --prefix tests
	BASE_URL=https://matejkosiarcik.com npm test --prefix tests
	npm ci --prefix visual-tests
	BASE_URL=https://matejkosiarcik.com npm test --prefix visual-tests

.PHONY: test-local
test-local:
	npm ci --prefix tests
	BASE_URL=http://localhost:8888 npm test --prefix tests
	npm ci --prefix visual-tests
	BASE_URL=http://localhost:8888 npm test --prefix visual-tests
