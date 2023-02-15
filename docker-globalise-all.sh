#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")
DOCKER_DOMAIN=registry.diginfra.net/tt
PROJECT=globalise

find .env -type f -exec sed -i "/^PROJECT=/s/=.*/=$PROJECT/" {} \;

docker build -t textannoviz-${PROJECT}-frontend:${VERSION} -f deploy/Dockerfile-deploy .

docker tag textannoviz-${PROJECT}-frontend:${VERSION} ${DOCKER_DOMAIN}/textannoviz-${PROJECT}-frontend:${VERSION}

docker push ${DOCKER_DOMAIN}/textannoviz-${PROJECT}-frontend:${VERSION}