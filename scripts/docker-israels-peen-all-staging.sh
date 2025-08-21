#!/bin/bash

export VERSION=$(npm pkg get version | tr -d \")-staging
export DOCKER_DOMAIN=registry.diginfra.net/tt
export PROJECT=israels
export TITLE="Textannoviz - Israëls"
export TAG=${DOCKER_DOMAIN}/textannoviz-${PROJECT}-frontend:${VERSION}
#ROUTER_BASENAME needs to be set to the subdomain TAV will run at on the server. If it runs at root level, it needs to be set to "/". For the preview environment, this needs to be set to "/app".
export ROUTER_BASENAME="/app"
export MODE="staging"

./scripts/docker-build-push.sh
