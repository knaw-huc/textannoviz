all: help
SHELL=/bin/bash
.SECONDARY:
.DELETE_ON_ERROR:

RED=\033[1;31m
GREEN=\033[1;32m
YELLOW=\033[1;33m
BLUE=\033[1;34m
RESET=\033[0m

SOURCES    := $(shell find ./src/ -type f)
BUILD_SRC  := package-lock.json ./scripts/docker-build-push.sh $(SOURCES)

.env: | .env.example
	cp .env.example .env

.make/:
	mkdir -p $@

.make/install-dependencies: package.json package-lock.json | .make/
	npm ci
	@touch $@

package-lock.json: package.json
	npm install

.PHONY: install-dependencies
install-dependencies: .env .make/install-dependencies package-lock.json

.PHONY: start
start: .env
	npm start
	open http://localhost:5173/

.PHONY: test
test: .make/install-dependencies
	npm test

.PHONY: build-css
build-css: .make/css

.make/css: ./scripts/build-project-css.sh $(wildcard tailwind.config.*.js) | .make/
	npm run build:css
	@touch $@

.PHONY: push
push: .make/push
.make/push: ./scripts/docker-build-push.sh ./deploy/Dockerfile-prod $(BUILD_SRC) .make/css | .make/
	npm run docker:build-push
	touch $@

clean:
	rm -rf .make/ dist/

.PHONY: help
help:
	@echo -e "Local make-tools for $(GREEN)textannoviz$(RESET)"
	@echo
	@echo -e "Please use \`$(YELLOW)make <target>$(RESET)', where $(YELLOW)<target>$(RESET) is one of:"
	@echo
	@echo -e " $(BLUE)install-dependencies$(RESET) - install the code dependencies"
	@echo -e " $(BLUE)build-css$(RESET)            - generate bespoke css per project, bases on tailwind.config.*.js"
	@echo -e " $(BLUE)test$(RESET)                 - run the tests"
	@echo -e " $(BLUE)clean$(RESET)                - remove generated files"
	@echo -e " $(BLUE)start$(RESET)                - run the front-end"
	@echo -e " $(BLUE)push$(RESET)                 - build the docker image and push it to the registry"
