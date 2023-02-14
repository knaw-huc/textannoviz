#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")
DOCKER_DOMAIN=registry.diginfra.net/tt

docker build -t textannoviz-globalise-frontend:${VERSION} -f deploy/Dockerfile-deploy .

docker tag textannoviz-globalise-frontend:${VERSION} ${DOCKER_DOMAIN}/textannoviz-globalise-frontend:${VERSION}

docker push ${DOCKER_DOMAIN}/textannoviz-globalise-frontend:${VERSION}