#
# This file is part of personal-website which is released under MIT license.
# See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
#

# DISCLAIMER: use '_' as prefix for private targets

### Config ###
SHELL = /bin/sh -euf
MAKEFLAGS += --warn-undefined-variables
TARGET_DIR = build
SOURCE_DIR = src

# get compilation mode
ifeq ($(mode), release)
	MODE = release
else
	MODE = debug
endif

# Default target
.PHONY: all
all: format doc lint build

# Help message
.PHONY: help
help:
	@printf "%s\n" "Available targets:"
	@grep -E "^([a-z\-]+):" $(MAKEFILE_LIST) | grep -Eo "^([a-z\-]+)" | sort | tr "\n" "," | sed -E "s~(.*)~\1~" | sed -E 's~^(.+),$$~\1~' | sed "s~,~, ~g"

# Cleaning
.PHONY: clean
clean:
	rm -rf "$(TARGET_DIR)"

# Just forwarding targets
.PHONY: format
format:
	./utils/format

.PHONY: lint
lint:
	./utils/lint

### Documentation ###
DOCUMENTATION_TARGET_DIR = $(TARGET_DIR)/doc
MARKDOWN_SOURCES = $(shell . "./utils/internal/helpers.sh" && files_ending ".md")
MARKDOWN_TARGETS = $(patsubst %.md,$(DOCUMENTATION_TARGET_DIR)/%.html,$(MARKDOWN_SOURCES))

$(DOCUMENTATION_TARGET_DIR)/%.html: %.md
	mkdir -p "$$(dirname $@)"
	grip "$<" --export "$@"

.PHONY: doc
doc: $(MARKDOWN_TARGETS)

### Build ###
PAGES_SOURCE_DIR = $(SOURCE_DIR)/pages
PAGES_TARGET_DIR = $(TARGET_DIR)/$(MODE)
SHARED_SOURCE_DIR = $(SOURCE_DIR)/shared
SHARED_TARGET_DIR = $(TARGET_DIR)/$(MODE)/_include

_pre-build:
	@printf "%s\n" "Building into: $(TARGET_DIR)"

## Style ##
STYLE_SOURCE_DIR = $(SHARED_SOURCE_DIR)/styles
STYLE_TARGET_DIR = $(SHARED_TARGET_DIR)/styles

# normalize.css
NORMALIZE_SOURCE = ./node_modules/normalize.css/normalize.css
NORMALIZE_TARGET = $(STYLE_TARGET_DIR)/normalize.css

$(NORMALIZE_TARGET): $(NORMALIZE_SOURCE)
	mkdir -p "$$(dirname "$@")"
	cp "$<" "$@"
	printf "%s\n" "$$(cssbeautify "$@")" >"$@"

_build-normalize: $(NORMALIZE_TARGET)

_build-style: _build-normalize

.PHONY: build
build: _pre-build _build-style
