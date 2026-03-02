#!/bin/bash

set -e

PROJECT_ID="correcttradingplatform"
REGION="europe-west2"
REPO="globalquantx"

echo "Setting project..."
gcloud config set project $PROJECT_ID

echo "Creating Artifact Registry..."
gcloud artifacts repositories create $REPO \
  --repository-format=docker \
  --location=$REGION \
  --description="GlobalQuantX container registry" || true

echo "Authenticating Docker..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev

echo "Creating GKE Autopilot cluster..."
gcloud container clusters create-auto globalquantx \
  --region=$REGION

echo "Getting cluster credentials..."
gcloud container clusters get-credentials globalquantx \
  --region=$REGION \
  --project=$PROJECT_ID

echo "Applying namespaces..."
kubectl apply -f infra/K8s/infra/namespaces.yaml

echo "Applying trading workloads..."
kubectl apply -f infra/K8s/trading

echo "Applying core workloads..."
kubectl apply -f infra/K8s/core

echo "Bootstrap complete!"

