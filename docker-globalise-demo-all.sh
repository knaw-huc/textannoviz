#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")
DOCKER_DOMAIN=registry.diginfra.net/tt
PROJECT=globalise

find .env -type f -exec sed -i '' -e "/^VITE_PROJECT=/s/=.*/=$PROJECT/" {} \;

#Uncomment this line if running this script with the GNU version of sed. See: https://riptutorial.com/sed/topic/9436/bsd-macos-sed-vs--gnu-sed-vs--the-posix-sed-specification
#find .env -type f -exec sed -i "/^PROJECT=/s/=.*/=$PROJECT/" {} \;

docker build -t textannoviz-${PROJECT}-demo-frontend:${VERSION} -f deploy/Dockerfile-deploy .

docker tag textannoviz-${PROJECT}-demo-frontend:${VERSION} ${DOCKER_DOMAIN}/textannoviz-${PROJECT}-demo-frontend:${VERSION}

docker push ${DOCKER_DOMAIN}/textannoviz-${PROJECT}-demo-frontend:${VERSION}