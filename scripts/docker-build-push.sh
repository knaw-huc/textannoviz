#!/usr/bin/env bash
set -xe
if [[
  -z $VERSION \
  || -z $DOCKER_DOMAIN \
  || -z $PROJECT \
  || -z $TITLE \
  || -z $TAG \
]]; then
  echo 'missing required env vars'
  exit 1
fi

sed \
  -e "/^VITE_PROJECT=/s/=.*/=$PROJECT/" \
  -e "/^VITE_TITLE=/s/=.*/=$TITLE/" \
  .env.example \
  > .env

docker build -t $TAG --platform=linux/amd64 -f deploy/Dockerfile-deploy .

docker push $TAG
