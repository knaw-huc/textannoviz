all: help
SHELL=/bin/bash
.SECONDARY:
.DELETE_ON_ERROR:

RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[0;33m
BLUE=\033[0;34m
RESET=\033[0m

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
push-brederode:
	npm run docker:build-push:brederode

.PHONY: push-bc1900
push-bc1900: .make/push-bc1900
.make/push-bc1900: package-lock.json ./scripts/docker-bc1900-all.sh ./scripts/docker-build-push.sh $(wildcard ./deploy/Dockerfile-*) | .make
	npm run docker:build-push:bc1900
	touch $@

.PHONY: push-oraties-staging
push-oraties-staging: .make/push-oraties-staging
.make/push-oraties-staging: package-lock.json ./scripts/docker-oraties-all-staging.sh ./scripts/docker-build-push.sh $(wildcard ./deploy/Dockerfile-*) | .make
	npm run docker:build-push:oraties-peen-staging
	touch $@

.PHONY: push-oraties-prod
push-oraties-prod: .make/push-oraties-prod
.make/push-oraties-prod: package-lock.json ./scripts/docker-oraties-peen-all.sh ./scripts/docker-build-push.sh $(wildcard ./deploy/Dockerfile-*) | .make
	npm run docker:build-push:oraties-peen-staging
	touch $@

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
