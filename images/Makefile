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
all: build

.PHONY: build
build:
	$(SHELL) favicon/build.sh
	$(SHELL) icons/build.sh
	$(SHELL) pictures/build.sh

.PHONY: clean
clean:
	rm -rf "**/artifacts"
