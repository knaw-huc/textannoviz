#!/bin/bash

export VERSION=$(npm pkg get version | tr -d \")
export DOCKER_DOMAIN=registry.diginfra.net/tt
export PROJECT=hooft
export TITLE="Textannoviz - Hooft"
export TAG=${DOCKER_DOMAIN}/textannoviz-${PROJECT}-frontend:${VERSION}

./docker-build-push.sh
