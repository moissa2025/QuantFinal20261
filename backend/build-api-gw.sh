docker buildx build \
  -f Dockerfile.api-gateway \
  --platform linux/amd64,linux/arm64 \
  -t europe-west2-docker.pkg.dev/globalquantx-prod/api/api-gateway:v0.0.12 \
  --push .

