all: help
SHELL=/bin/bash
.SECONDARY:
.DELETE_ON_ERROR:

.env: .env.example
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

.make/push-bc1900: package-lock.json ./scripts/docker-bc1900-all.sh ./scripts/docker-build-push.sh $(wildcard ./deploy/Dockerfile-*) | .make
	npm run docker:build-push:bc1900
	touch $@

.PHONY: push-bc1900
push-bc1900: .make/push-bc1900

.PHONY: help
help:
	@echo "local make-tools for textannoviz"
	@echo
	@echo "Please use \`make <target>', where <target> is one of:"
	@echo
	@echo " install-dependencies - install the code dependencies"
	@echo " test                 - run the tests"
	@echo " start                - run the front-end"
	@echo " push-brederode       - build the docker image for brederode and push it to the registry"
	@echo " push-bc1900          - build the docker image for brieven-correspondenten-1900 and push it to the registry"
