FROM python:3.9-slim-bullseye

WORKDIR /usr/src/app
RUN pip install flask
RUN apt-get update && apt-get install curl jq git inetutils-ping iproute2 -y
