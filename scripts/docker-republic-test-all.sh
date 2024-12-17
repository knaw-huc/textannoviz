#!/bin/bash

export VERSION=$(npm pkg get version | tr -d \")
export DOCKER_DOMAIN=registry.diginfra.net/tt
export PROJECT=republic
export TITLE="Textannoviz - Republic"
export TAG=${DOCKER_DOMAIN}/textannoviz-${PROJECT}-test-frontend:${VERSION}

./scripts/docker-build-push.sh
