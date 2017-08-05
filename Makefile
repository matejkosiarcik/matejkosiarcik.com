#
# This file is part of personal-website which is released under MIT license.
# See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
#

# DISCLAIMER: use '_' as prefix for private targets

### Config ###
SHELL = /bin/sh -euf
MAKEFLAGS += --warn-undefined-variables
BUILD_PATH = build

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
	rm -rf "$(BUILD_PATH)"

# Just forwarding targets
.PHONY: format
format:
	./utils/format

.PHONY: lint
lint:
	./utils/lint

### Documentation ###
DOCS_PATH = $(BUILD_PATH)/doc
MARKDOWN_SOURCES = $(shell . ./utils/internal/helpers.sh && markdown_files)
MARKDOWN_TARGETS = $(patsubst %.md,$(DOCS_PATH)/%.html,$(MARKDOWN_SOURCES))

$(DOCS_PATH)/%.html: %.md
	mkdir -p "$$(dirname $@)"
	grip "$<" --export "$@"

.PHONY: doc
doc: $(MARKDOWN_TARGETS)

### Build ###
PAGES_PATH = $(BUILD_PATH)/$(MODE)
SHARED_PATH = $(BUILD_PATH)/$(MODE)/_include

.PHONY: build
build:
	@printf "%s\n" "Building into: $(BUILD_PATH)"
