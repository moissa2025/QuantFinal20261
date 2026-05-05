#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "❌ No tag provided."
  echo "Usage: ./load-1-image.sh v0.2.5"
  exit 1
fi

TAG=$1
SERVICE="api-gateway"

# Auto-detect KIND cluster
CLUSTER=$(kind get clusters | head -n 1)

if [ -z "$CLUSTER" ]; then
  echo "❌ No KIND cluster found."
  exit 1
fi

echo "📥 Loading $SERVICE:$TAG into KIND cluster '$CLUSTER'..."
echo ""

kind load docker-image $SERVICE:$TAG --name "$CLUSTER"

echo ""
echo "✅ Loaded $SERVICE:$TAG into KIND cluster '$CLUSTER'"

