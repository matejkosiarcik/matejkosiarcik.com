### Config ###
SHELL = /bin/sh -euf
MAKEFLAGS += --warn-undefined-variables

### Setup ###
TARGET_DIR = build
DEBUG_DIR = $(TARGET_DIR)/debug
RELEASE_DIR = $(TARGET_DIR)/release

# Default target
.PHONY: all
all: build test

# Help message
.PHONY: help
help:
	@printf 'Available targets:\n'
	@grep -E '^([a-z\-]+):' $(MAKEFILE_LIST) | grep -Eo '^([a-z\-]+)' | sort | tr '\n' ',' | sed -E 's~^(.+),$$~\1~' | sed 's~,~, ~g'

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

# Testing
.PHONY: test
test: $(SWIFT_DIR) build
	swift test -Xswiftc -DDEBUG

### Build ###
SOURCE_DIR = sources
PAGES_SOURCE_DIR = $(SOURCE_DIR)/web
PAGES_TARGET_DIR = $(DEBUG_DIR)
SHARED_SOURCE_DIR = $(SOURCE_DIR)/shared
SHARED_TARGET_DIR = $(DEBUG_DIR)/_include

## Code ##
# Markup #
# Mustache -> HTML
MARKUP_SHARED_SOURCES = $(wildcard $(SHARED_SOURCE_DIR)/sources/markup/*.mustache)
MARKUP_SOURCES = $(shell find "$(PAGES_SOURCE_DIR)" -name "*.mustache")
MARKUP_TARGETS = $(patsubst $(PAGES_SOURCE_DIR)%.mustache, $(PAGES_TARGET_DIR)%, $(MARKUP_SOURCES))
MARKUP_DATA = $(shell find "$(PAGES_SOURCE_DIR)" -name "data.json")

$(PAGES_TARGET_DIR)%: $(PAGES_SOURCE_DIR)%.mustache $(MARKUP_SHARED_SOURCES) $(MARKUP_DATA)
	mkdir -p "$(@D)"
	python3 'utils/mustache_builder.py' --template "$<" --data "$(<D)/data.json" >"$@"

_build-markup: $(MARKUP_TARGETS)

# Styles #
NORMALIZE_DIR = $(NODE_DIR)/normalize.css
STYLE_SOURCE_DIR = $(SHARED_SOURCE_DIR)/sources/styles
STYLE_TARGET_DIR = $(SHARED_TARGET_DIR)/styles

# SASS -> CSS
STYLE_INTERNAL = $(wildcard $(STYLE_SOURCE_DIR)/_*.scss)
STYLE_SHARED_SOURCES = $(filter-out $(STYLE_INTERNAL), $(wildcard $(STYLE_SOURCE_DIR)/*.scss))
STYLE_SHARED_TARGETS = $(patsubst $(STYLE_SOURCE_DIR)/%.scss, $(STYLE_TARGET_DIR)/%.css, $(STYLE_SHARED_SOURCES))
SASS_FLAGS = --scss --unix-newlines --style=expanded --load-path="$(STYLE_SOURCE_DIR)"

$(STYLE_TARGET_DIR)/%.css: $(STYLE_SOURCE_DIR)/%.scss $(STYLE_INTERNAL)
	mkdir -p "$(@D)"
	sass $(SASS_FLAGS) --load-path="$(NORMALIZE_DIR)" "$<" "$@"
	postcss "$@" --use autoprefixer -o "$@" 2>/dev/null
	printf "%s\n" "$$(cssbeautify "$@")" >"$@"

STYLE_PAGE_SOURCES = $(shell find "$(PAGES_SOURCE_DIR)" -name "*.scss")
STYLE_PAGE_TARGETS = $(patsubst $(PAGES_SOURCE_DIR)/%.scss, $(PAGES_TARGET_DIR)/%.css, $(STYLE_PAGE_SOURCES))

$(PAGES_TARGET_DIR)/%.css: $(PAGES_SOURCE_DIR)/%.scss $(STYLE_INTERNAL)
	mkdir -p "$(@D)"
	sass $(SASS_FLAGS) "$<" "$@"
	printf "%s\n" "$$(cssbeautify "$@")" >"$@"

_build-style: $(STYLE_SHARED_TARGETS) $(STYLE_PAGE_TARGETS) #$(NORMALIZE_TARGET)

_build-code: _build-markup _build-style

## Assets ##
ASSET_SOURCE_DIR = $(SHARED_SOURCE_DIR)/assets
ASSET_TARGET_DIR = $(SHARED_TARGET_DIR)

# Shared
ASSET_SHARED_SOURCES = $(shell find "$(ASSET_SOURCE_DIR)" -type f)
ASSET_SHARED_TARGETS = $(patsubst $(ASSET_SOURCE_DIR)/%, $(ASSET_TARGET_DIR)/%, $(ASSET_SHARED_SOURCES))

$(ASSET_TARGET_DIR)/%: $(ASSET_SOURCE_DIR)/%
	mkdir -p "$(@D)"
	cp "$<" "$@"

# Pages
ASSET_PAGE_SOURCES = $(shell find "$(PAGES_SOURCE_DIR)" -type f -path "*/_*/*")
ASSET_PAGE_TARGETS = $(patsubst $(PAGES_SOURCE_DIR)/%, $(PAGES_TARGET_DIR)/%, $(ASSET_PAGE_SOURCES))

$(PAGES_TARGET_DIR)/%.ico: $(PAGES_SOURCE_DIR)/%.ico
	mkdir -p "$(@D)"
	cp "$<" "$@"

$(PAGES_TARGET_DIR)/%.png: $(PAGES_SOURCE_DIR)/%.png
	mkdir -p "$(@D)"
	cp "$<" "$@"

$(PAGES_TARGET_DIR)/%.jpg: $(PAGES_SOURCE_DIR)/%.jpg
	mkdir -p "$(@D)"
	cp "$<" "$@"

$(PAGES_TARGET_DIR)/%.svg: $(PAGES_SOURCE_DIR)/%.svg
	mkdir -p "$(@D)"
	cp "$<" "$@"

_build-assets: $(ASSET_SHARED_TARGETS) $(ASSET_PAGE_TARGETS)

## Config ##
# Apache config
APACHE_DEPENDENCY = $(NODE_DIR)/apache-server-configs/dist/.htaccess
APACHE_SOURCE = $(PAGES_SOURCE_DIR)/.htaccess
APACHE_TARGET = $(PAGES_TARGET_DIR)/.htaccess

$(APACHE_TARGET): $(APACHE_SOURCE) $(APACHE_DEPENDENCY)
	mkdir -p "$(@D)"
	cat $^ >"$@"

_build-config: $(APACHE_TARGET)

## General ##
.PHONY: build
build: $(NODE_DIR) _build-code _build-assets _build-config
