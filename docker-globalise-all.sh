#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")
DOCKER_DOMAIN=registry.diginfra.net/tt
PROJECT=globalise
TITLE="Textannoviz - Globalise"
TAG=${DOCKER_DOMAIN}/textannoviz-${PROJECT}-frontend:${VERSION}

./docker-build-push.sh
