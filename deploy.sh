#!/bin/sh
set -ue

docker login -u kontenabot -p $DOCKER_HUB_PASSWORD
docker build --pull -t kontena/docs:latest .
docker push kontena/docs:latest