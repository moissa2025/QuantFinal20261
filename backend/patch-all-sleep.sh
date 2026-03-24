#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="trading-platform"

DEPLOYS=$(kubectl get deploy -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}')

for d in $DEPLOYS; do
  echo ">>> Patching $d to sleep 3600…"

  kubectl patch deploy "$d" -n "$NAMESPACE" \
    --type='json' \
    -p='[{"op":"replace","path":"/spec/template/spec/containers/0/command","value":["sh","-c","sleep 3600"]}]'
done

echo ""
echo "🎉 All deployments patched to sleep mode."

