#!/bin/sh
set -ue

docker login -u kontenabot -p $DOCKERHUB_PASSWORD
docker build --pull -t kontena/docs:latest .
docker push kontena/docs:latest