#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")

docker build -t textannoviz-frontend:${VERSION} -f deploy/Dockerfile-deploy .