#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")
DOCKER_DOMAIN=registry.diginfra.net/tt

docker build -t textannoviz-frontend:${VERSION} -f deploy/Dockerfile-deploy .

docker tag textannoviz-frontend:${VERSION} ${DOCKER_DOMAIN}/textannoviz-frontend:${VERSION}

docker push ${DOCKER_DOMAIN}/textannoviz-frontend:${VERSION}