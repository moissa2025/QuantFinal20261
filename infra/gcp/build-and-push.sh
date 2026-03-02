#!/bin/bash

set -e

PROJECT_ID="correcttradingplatform"
REGION="europe-west2"
REPO="globalquantx"

echo "Building core-trading..."
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/core-trading:latest \
  backend/services/trading-service

echo "Building api-gateway..."
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/api-gateway:latest \
  backend/services/api-gateway

echo "Building frontend..."
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/frontend:latest \
  frontend/globalquantx-ui

echo "Pushing images..."
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/core-trading:latest
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/api-gateway:latest
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/frontend:latest

echo "Done!"

