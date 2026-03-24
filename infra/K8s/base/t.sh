kubectl get secret aml-db-url -n trading-platform -o jsonpath='{.data.ca\.crt}' \
  | xargs -I {} kubectl patch secret apigw-db-url -n trading-platform \
    --type='json' \
    -p='[{"op": "add", "path": "/data/ca.crt", "value": "{}"}]'

