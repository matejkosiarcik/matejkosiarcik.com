#
# This file is part of personal-website which is released under MIT license.
# See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
#

# DISCLAIMER: use '_' as prefix for private targets

### Config ###
SHELL = /bin/sh -euf
MAKEFLAGS += --warn-undefined-variables

### Setup ###
SOURCE_DIR = sources
TARGET_DIR = build
DEBUG_DIR = $(TARGET_DIR)/debug
RELEASE_DIR = $(TARGET_DIR)/release

# Default target
.PHONY: all
all: fmt doc lint build test

# Help message
.PHONY: help
help:
	@printf "%s\n" "Available targets:"
	@grep -E "^([a-z\-]+):" $(MAKEFILE_LIST) | grep -Eo "^([a-z\-]+)" | sort | tr "\n" "," | sed -E "s~(.*)~\1~" | sed -E 's~^(.+),$$~\1~' | sed "s~,~, ~g"

# Cleaning
.PHONY: clean
clean:
	rm -rf "$(TARGET_DIR)"

.PHONY: distclean
distclean: clean
	rm -rf "$(NODE_DIR)"
	rm -rf "$(SWIFT_DIR)"
	rm -rf "$(wildcard *.xcodeproj)"

# Dependency resolution
NODE_DIR = node_modules
SWIFT_DIR = .build

$(NODE_DIR):
	npm install --save --saveDev

$(SWIFT_DIR):
	swift package resolve

.PHONY: bootstrap
bootstrap: $(NODE_DIR) $(SWIFT_DIR)

.PHONY: update
update:
	npm update --save --saveDev
	swift package update

# Just forwarding targets
.PHONY: fmt
fmt:
	./utils/format

.PHONY: lint
lint:
	./utils/lint

.PHONY: test
test: $(SWIFT_DIR) build
	swift test

### Documentation ###
DOCUMENTATION_TARGET_DIR = $(TARGET_DIR)/doc
MARKDOWN_SOURCES = $(shell . "./utils/internal/helpers.sh" && files_ending ".md")
MARKDOWN_TARGETS = $(patsubst %.md, $(DOCUMENTATION_TARGET_DIR)/%.html, $(MARKDOWN_SOURCES))

$(DOCUMENTATION_TARGET_DIR)/%.html: %.md
	mkdir -p "$$(dirname $@)"
	grip "$<" --export "$@"

.PHONY: doc
doc: $(MARKDOWN_TARGETS)

### Build ###
PAGES_SOURCE_DIR = $(SOURCE_DIR)/web
PAGES_TARGET_DIR = $(DEBUG_DIR)
SHARED_SOURCE_DIR = $(SOURCE_DIR)/shared
SHARED_TARGET_DIR = $(DEBUG_DIR)/_include

## Code ##
# Markup #
# Mustache -> HTML
MARKUP_SHARED_SOURCES = $(wildcard $(SHARED_SOURCE_DIR)/sources/markup/*.html.mustache)
MARKUP_SOURCES = $(shell find "$(PAGES_SOURCE_DIR)" -name "content.html.mustache")
MARKUP_TARGETS = $(patsubst $(PAGES_SOURCE_DIR)%content.html.mustache, $(PAGES_TARGET_DIR)%index.html, $(MARKUP_SOURCES))

$(PAGES_TARGET_DIR)%index.html: $(PAGES_SOURCE_DIR)%content.html.mustache $(PAGES_SOURCE_DIR)%data.json $(MARKUP_SHARED_SOURCES)
	mkdir -p "$$(dirname "$@")"
	python "./utils/internal/build_mustache.py" --data "$$(dirname "$<")" --output "$$(dirname "$@")"

_build-markup: $(MARKUP_TARGETS)

# Styles #
STYLE_SOURCE_DIR = $(SHARED_SOURCE_DIR)/sources/styles
STYLE_TARGET_DIR = $(SHARED_TARGET_DIR)/styles

# normalize.css
NORMALIZE_SOURCE = $(NODE_DIR)/normalize.css/normalize.css
NORMALIZE_TARGET = $(STYLE_TARGET_DIR)/normalize.css

$(NORMALIZE_TARGET): $(NORMALIZE_SOURCE)
	mkdir -p "$$(dirname "$@")"
	cp "$<" "$@"
	printf "%s\n" "$$(cssbeautify "$@")" >"$@"

_build-normalize: $(NORMALIZE_TARGET)

# SASS -> CSS
STYLE_INTERNAL = $(wildcard $(STYLE_SOURCE_DIR)/_*.scss)
STYLE_SHARED_SOURCES = $(filter-out $(STYLE_INTERNAL), $(wildcard $(STYLE_SOURCE_DIR)/*.scss))
STYLE_SHARED_TARGETS = $(patsubst $(STYLE_SOURCE_DIR)/%.scss, $(STYLE_TARGET_DIR)/%.css, $(STYLE_SHARED_SOURCES))

$(STYLE_TARGET_DIR)/%.css: $(STYLE_SOURCE_DIR)/%.scss $(STYLE_INTERNAL)
	mkdir -p "$$(dirname "$@")"
	sass --scss --unix-newlines --style=expanded --load-path="$(STYLE_SOURCE_DIR)" "$<" "$@"
	printf "%s\n" "$$(cssbeautify "$@")" >"$@"

STYLE_PAGE_SOURCES = $(shell find "$(PAGES_SOURCE_DIR)" -type f -name "*.scss")
STYLE_PAGE_TARGETS = $(patsubst $(PAGES_SOURCE_DIR)/%.scss, $(PAGES_TARGET_DIR)/%.css, $(STYLE_PAGE_SOURCES))

$(PAGES_TARGET_DIR)/%.css: $(PAGES_SOURCE_DIR)/%.scss $(STYLE_INTERNAL)
	mkdir -p "$$(dirname "$@")"
	sass --scss --unix-newlines --style=expanded --load-path="$(STYLE_SOURCE_DIR)" "$<" "$@"
	printf "%s\n" "$$(cssbeautify "$@")" >"$@"

_build-sass: $(STYLE_SHARED_TARGETS) $(STYLE_PAGE_TARGETS)

_build-style: _build-normalize _build-sass

# Scripts #
SCRIPT_SOURCE_DIR = $(SHARED_SOURCE_DIR)/sources/scripts
SCRIPT_TARGET_DIR = $(SHARED_TARGET_DIR)/scripts

# TypeScript -> JavaScript
SCRIPT_SHARED_INTERNAL = $(wildcard $(SCRIPT_SOURCE_DIR)/_*.ts)
SCRIPT_SHARED_SOURCES = $(filter-out $(SCRIPT_SHARED_INTERNAL), $(wildcard $(SCRIPT_SOURCE_DIR)/*.ts))
SCRIPT_SHARED_TARGETS = $(patsubst $(SCRIPT_SOURCE_DIR)/%.ts, $(SCRIPT_TARGET_DIR)/%.js, $(SCRIPT_SHARED_SOURCES))
TYPESCRIPT_FLAGS = --module "commonjs" --target "ES3" --newLine "LF" \
	--removeComments --preserveConstEnums --forceConsistentCasingInFileNames \
	--strict --alwaysStrict --strictNullChecks \
	--noEmitOnError --noImplicitAny --noImplicitThis --noImplicitReturns \
	--noUnusedLocals --noUnusedParameters --noFallthroughCasesInSwitch

$(SCRIPT_TARGET_DIR)/%.js: $(SCRIPT_SOURCE_DIR)/%.ts $(SCRIPT_SHARED_INTERNAL)
	mkdir -p "$$(dirname "$@")"
	tsc $(TYPESCRIPT_FLAGS) "$<" --outDir "$$(dirname "$@")"
	browserify "$@" --outfile "$@"

_build-typescript: $(SCRIPT_SHARED_TARGETS)

_build-scripts: _build-typescript

_build-code: _build-markup _build-style _build-scripts

## Assets ##
ASSET_SOURCE_DIR = $(SHARED_SOURCE_DIR)/assets
ASSET_TARGET_DIR = $(SHARED_TARGET_DIR)

# Shared
ASSET_SHARED_SOURCES = $(wildcard $(ASSET_SOURCE_DIR)/*)
ASSET_SHARED_TARGETS = $(patsubst $(ASSET_SOURCE_DIR)/%, $(ASSET_TARGET_DIR)/%, $(ASSET_SHARED_SOURCES))

$(ASSET_TARGET_DIR)/%: $(ASSET_SOURCE_DIR)/%
	mkdir -p "$$(dirname "$@")"
	cp -R "$<" "$@"

# Pages
ASSET_PAGE_SOURCES = $(shell find "$(PAGES_SOURCE_DIR)" -type d -name "_*")
ASSET_PAGE_TARGETS = $(patsubst $(PAGES_SOURCE_DIR)/%, $(PAGES_TARGET_DIR)/%, $(ASSET_PAGE_SOURCES))

$(PAGES_TARGET_DIR)/%: $(PAGES_SOURCE_DIR)/%
	mkdir -p "$$(dirname "$@")"
	cp -R "$<" "$@"

_build-assets: $(ASSET_SHARED_TARGETS) $(ASSET_PAGE_TARGETS)

## Config ##
# Apache config
APACHE_DEPENDENCY = $(NODE_DIR)/apache-server-configs/dist/.htaccess
APACHE_ROOT_SOURCE = $(SOURCE_DIR)/.htaccess
APACHE_ROOT_TARGET = $(DEBUG_DIR)/.htaccess

$(APACHE_ROOT_TARGET): $(APACHE_ROOT_SOURCE) $(APACHE_DEPENDENCY)
	mkdir -p "$$(dirname "$@")"
	cat $^ >"$@"

_build-config: $(APACHE_ROOT_TARGET)

## General ##
.PHONY: build
build: $(NODE_DIR) _build-code _build-assets _build-config
