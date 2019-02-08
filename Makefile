#! make

MAKEFLAGS += --silent
include .env
export $(shell sed 's/=.*//' .env)


ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(ARGS):;@:)

run: build
	node -r source-map-support/register dist/bin/flowUtils.js temp/source.js temp/dist.js
	# npx prettier-eslint --write temp/*
.PHONY: run

build:
	rm -rf dist/
	# npx flow-remove-types --all --pretty src --out-dir dist
	npx babel src --out-dir dist --source-maps inline --copy-files
.PHONY: build

test:
	NODE_ENV=test \
	npx jest
.PHONY: test

install:
	npm install && \
	flow-typed install
.PHONY: install

lint:
	npx eslint .
.PHONY: lint

flow:
	npx flow
.PHONY: flow

full-test: lint flow test
.PHONY: full-test

prettier:
	npx prettier-eslint --write "src/**/*.js"
.PHONY: prettier
