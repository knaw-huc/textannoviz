#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")
DOCKER_DOMAIN=registry.diginfra.net/tt

docker build -t textannoviz-republic-frontend:${VERSION} -f deploy/Dockerfile-deploy .

docker tag textannoviz-republic-frontend:${VERSION} ${DOCKER_DOMAIN}/textannoviz-republic-frontend:${VERSION}

docker push ${DOCKER_DOMAIN}/textannoviz-republic-frontend:${VERSION}