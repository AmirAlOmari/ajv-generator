SHELL := $(shell which bash)
.SHELLFLAGS = -c

.SILENT: ;               # No need for @
.ONESHELL: ;             # Recipes execute in same shell
.NOTPARALLEL: ;          # Wait for this target to finish
.EXPORT_ALL_VARIABLES: ; # Send all vars to shell

default: help

help: ## Display help for make commands
	grep -E '^[0-9a-zA-Z_-]+:.*?# .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help

# Run commands

deps: ## Install dependencies
	yarn install
.PHONY: deps

init: ## Initialize
.PHONY: init

build: ## Run TS build
	yarn run build
.PHONY: build

build-watch: ## Run TS build and watch modified files
	yarn run build:watch
.PHONY: build-watch

run-watch: init ## Run TS build, watch modified files and run application
	yarn run serve:watch
.PHONY: run-watch

# Units tests commands

test-init: ## Initialize units tests
.PHONY: test-init

test: test-init ## Run unit tests
	yarn run test
.PHONY: test

test-watch: test-init ## Run unit tests and watch modified files
	yarn run test:watch
.PHONY: test-watch

test-cover: test-init ## Run unit tests with code coverage
	yarn run test:cover
.PHONY: test-cover

# E2E tests commands

test-init-e2e: ## Initialize E2E tests
.PHONY: test-init-e2e

test-e2e: test-init-e2e ## Run E2E tests
	yarn run test:e2e
.PHONY: test-e2e

test-e2e-watch: test-e2e-init ## Run E2E tests and watch modified files
	yarn run test:e2e:watch
.PHONY: test-e2e-watch

# Publish commands

publish: ## Publish `ajv-generator` to NPM
	yarn run publish
.PHONY: publish

# Misc.

lint: ## Check syntax errors
	yarn run lint
.PHONY: lint

format: ## Enforce syntax format
	yarn run format
.PHONY: format
