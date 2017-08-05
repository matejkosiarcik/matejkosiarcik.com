#
# This file is part of personal-website which is released under MIT license.
# See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
#

# DISCLAIMER: use '_' as prefix for private targets

### Config ###
SHELL = /bin/sh -euf
MAKEFLAGS += --warn-undefined-variables
TARGET_PATH = build
SOURCE_PATH = src

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
	rm -rf "$(TARGET_PATH)"

# Just forwarding targets
.PHONY: format
format:
	./utils/format

.PHONY: lint
lint:
	./utils/lint

### Documentation ###
TARGET_DOCUMENTATION_PATH = $(TARGET_PATH)/doc
MARKDOWN_SOURCES = $(shell . "./utils/internal/helpers.sh" && files_ending ".md")
MARKDOWN_TARGETS = $(patsubst %.md,$(TARGET_DOCUMENTATION_PATH)/%.html,$(MARKDOWN_SOURCES))

$(TARGET_DOCUMENTATION_PATH)/%.html: %.md
	mkdir -p "$$(dirname $@)"
	grip "$<" --export "$@"

.PHONY: doc
doc: $(MARKDOWN_TARGETS)

### Build ###
SOURCE_PAGES_PATH = $(SOURCE_PATH)/pages
TARGET_PAGES_PATH = $(TARGET_PATH)/$(MODE)
SOURCE_SHARED_PATH = $(SOURCE_PATH)/shared
TARGET_SHARED_PATH = $(TARGET_PATH)/$(MODE)/_include

_pre-build:
	@printf "%s\n" "Building into: $(TARGET_PATH)"

## Style ##
SOURCE_STYLE_PATH = $(SOURCE_SHARED_PATH)/styles
TARGET_STYLE_PATH = $(TARGET_SHARED_PATH)/styles

# normalize.css
NORMALIZE_SOURCE = ./node_modules/normalize.css/normalize.css
NORMALIZE_TARGET = $(TARGET_STYLE_PATH)/normalize.css

$(NORMALIZE_TARGET): $(NORMALIZE_SOURCE)
	mkdir -p "$$(dirname "$@")"
	cp "$<" "$@"

_build-normalize: $(NORMALIZE_TARGET)

_build-style: _build-normalize

.PHONY: build
build: _pre-build _build-style
