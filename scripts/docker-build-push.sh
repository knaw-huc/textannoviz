#!/usr/bin/env bash
set -xe
if [[
  -z $VERSION \
  || -z $DOCKER_DOMAIN \
  || -z $PROJECT \
  || -z $TITLE \
  || -z $TAG \
  || -z $ROUTER_BASENAME
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

docker build -t $TAG --platform=linux/amd64 -f deploy/Dockerfile-deploy .

docker push $TAG

#Reset VITE_ROUTER_BASENAME back to "/" in .env
sed \
  -e "/^VITE_PROJECT=/s/=.*/=$PROJECT/" \
  -e "/^VITE_TITLE=/s/=.*/=$TITLE/" \
  -e "/^VITE_ROUTER_BASENAME=/s/=.*/=\//" \
  .env.example \
  > .env