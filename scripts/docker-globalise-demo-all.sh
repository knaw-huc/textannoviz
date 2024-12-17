#!/bin/bash

export VERSION=$(npm pkg get version | tr -d \")
export DOCKER_DOMAIN=registry.diginfra.net/tt
export PROJECT=globalise
export TITLE="Globalise Transcriptions Viewer"
export TAG=${DOCKER_DOMAIN}/textannoviz-${PROJECT}-demo-frontend:${VERSION}

./scripts/docker-build-push.sh
