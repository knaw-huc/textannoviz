#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")
DOCKER_DOMAIN=registry.diginfra.net/tt
PROJECT=republic
TITLE="Textannoviz - Republic"

find .env -type f -exec sed -i '' -e "/^VITE_PROJECT=/s/=.*/=$PROJECT/" {} \;
find .env -type f -exec sed -i '' -e "/^VITE_TITLE=/s/=.*/=$TITLE/" {} \;

#Uncomment this line if running this script with the GNU version of sed. See: https://riptutorial.com/sed/topic/9436/bsd-macos-sed-vs--gnu-sed-vs--the-posix-sed-specification
#find .env -type f -exec sed -i "/^PROJECT=/s/=.*/=$PROJECT/" {} \;

docker build -t textannoviz-${PROJECT}-histogram-frontend:${VERSION} --platform=linux/amd64 -f deploy/Dockerfile-deploy .

docker tag textannoviz-${PROJECT}-histogram-frontend:${VERSION} ${DOCKER_DOMAIN}/textannoviz-${PROJECT}-histogram-frontend:${VERSION}

docker push ${DOCKER_DOMAIN}/textannoviz-${PROJECT}-histogram-frontend:${VERSION}
