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

.make:
	mkdir .make

.make/install-dependencies: package.json package-lock.json | .make
	npm ci --force
	@touch $@

package-lock.json: package.json
	npm install --force

.PHONY: install-dependencies
install-dependencies: .env .make/install-dependencies package-lock.json

.PHONY: start
start: .env
	npm start
	open http://localhost:5173/

.PHONY: test
test: .make/install-dependencies
	npm test

.PHONY: push-brederode
push-brederode: .make/push-brederode
.make/push-brederode: ./scripts/docker-brederode-all.sh ./deploy/Dockerfile-prod $(BUILD_SRC) | .make
	npm run docker:build-push:brederode
	touch $@

.PHONY: push-oraties-staging
push-oraties-staging: .make/push-oraties-staging
.make/push-oraties-staging: ./scripts/docker-oraties-all-staging.sh ./deploy/Dockerfile-staging $(BUILD_SRC) | .make
	npm run docker:build-push:oraties-peen-staging
	touch $@

.PHONY: push-oraties-prod
push-oraties-prod: .make/push-oraties-prod
.make/push-oraties-prod: ./scripts/docker-oraties-peen-all.sh ./deploy/Dockerfile-prod $(BUILD_SRC) | .make
	npm run docker:build-push:oraties-peen-prod
	touch $@

#.PHONY: push-bc1900
#push-bc1900: .make/push-bc1900
#.make/push-bc1900: ./scripts/docker-bc1900-all.sh $(BUILDSRC) | .make
#	npm run docker:build-push:bc1900
#	touch $@

.PHONY: help
help:
	@echo -e "Local make-tools for $(GREEN)textannoviz$(RESET)"
	@echo
	@echo -e "Please use \`$(YELLOW)make <target>$(RESET)', where $(YELLOW)<target>$(RESET) is one of:"
	@echo
	@echo -e " $(BLUE)install-dependencies$(RESET) - install the code dependencies"
	@echo -e " $(BLUE)test$(RESET)                 - run the tests"
	@echo -e " $(BLUE)start$(RESET)                - run the front-end"
	@echo -e " $(BLUE)push-brederode$(RESET)       - build the docker image for brederode and push it to the registry"
	@echo -e " $(BLUE)push-oraties-staging$(RESET) - build the docker image for oraties (staging) and push it to the registry"
	@echo -e " $(BLUE)push-oraties-prod$(RESET)    - build the docker image for oraties (prod) and push it to the registry"
