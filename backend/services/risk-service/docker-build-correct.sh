docker buildx create --use
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t europe-west2-docker.pkg.dev/globalquantx-prod/risk/risk-service:latest \
  --push .

