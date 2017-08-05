#
# This file is part of personal-website which is released under MIT license.
# See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
#

# general config
SHELL = /bin/sh -euf
MAKEFLAGS += --warn-undefined-variables

# get configuration mode
ifeq ($(mode), release)
	MODE = release
else
	MODE = debug
endif

# path config
BUILD_PATH = "build/$(MODE)"
# OUTPUT_PATH = $(BUILD_PATH)/main
# BIN_PATH = $(BUILD_PATH)/bin

.PHONY: all
all: prepare build

.PHONY: build
build:
	@printf "%s\n" "Building into: $(BUILD_PATH)"

.PHONY: prepare
prepare: format doc lint

.PHONY: format
format:
	./utils/format

.PHONY: lint
lint:
	./utils/lint

.PHONY: doc
doc:
	./utils/docgen

.PHONY: help
help:
	@printf "%s\n" "Available targets:"
	@grep -E "^([a-z\-]+):" $(MAKEFILE_LIST) | grep -Eo "^([a-z\-]+)" | sort | tr "\n" "," | sed -E "s~(.*)~\1~" | sed -E 's~^(.+),$$~\1~' | sed "s~,~, ~g"
