#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")
DOCKER_DOMAIN=registry.diginfra.net/tt

docker tag textannoviz-frontend:${VERSION} ${DOCKER_DOMAIN}/textannoviz-frontend:${VERSION}