#! make

# MAKEFLAGS += --silent
include .env
export $(shell sed 's/=.*//' .env)


ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(ARGS):;@:)

run:
	node src/index.js

test:
	NODE_ENV=test \
	npx jest
.PHONY: test

install:
	npm install
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
