#!/bin/bash

export PROJECT=vangogh

export VERSION=dev
export DOCKER_DOMAIN=registry.diginfra.net/tt
export TITLE="Textannoviz - $PROJECT (DEV)"
export TAG=${DOCKER_DOMAIN}/textannoviz-${PROJECT}-frontend:dev
#ROUTER_BASENAME needs to be set to the subdomain TAV will run at on the server. If it runs at root level, it needs to be set to "/". For the preview environment, this needs to be set to "/app".
export ROUTER_BASENAME="/app"
export MODE="prod"

if [[
  -z $VERSION \
  || -z $DOCKER_DOMAIN \
  || -z $PROJECT \
  || -z $TITLE \
  || -z $TAG \
  || -z $ROUTER_BASENAME \
  || -z $MODE
]]; then
  echo 'missing required env vars'
  exit 1
fi

sed \
  -e "/^VITE_PROJECT=/s/=.*/=$PROJECT/" \
  -e "/^VITE_TITLE=/s/=.*/=$TITLE/" \
  -e "/^VITE_ROUTER_BASENAME=/s|=.*|=$ROUTER_BASENAME|" \
  .env.example \
  > .env

docker build -t $TAG --platform=linux/amd64 -f deploy/Dockerfile-$MODE .

#Reset VITE_ROUTER_BASENAME back to "/" in .env
sed \
  -e "/^VITE_PROJECT=/s/=.*/=$PROJECT/" \
  -e "/^VITE_TITLE=/s/=.*/=$TITLE/" \
  -e "/^VITE_ROUTER_BASENAME=/s/=.*/=\//" \
  .env.example \
  > .env