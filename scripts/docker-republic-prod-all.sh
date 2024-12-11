#!/bin/bash

export VERSION=$(npm pkg get version | tr -d \")
export DOCKER_DOMAIN=registry.diginfra.net/tt
export PROJECT=republic
export TITLE="Goetgevonden - applicatie"
export TAG=${DOCKER_DOMAIN}/textannoviz-${PROJECT}-prod-frontend:${VERSION}

./scripts/docker-build-push.sh