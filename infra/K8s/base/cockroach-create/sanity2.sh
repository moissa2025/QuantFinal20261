kubectl exec -it cockroachdb-0 -n trading-platform -- \
  ./cockroach node status --insecure \
  --host=cockroachdb-0.cockroachdb.trading-platform.svc.cluster.local:26257

kubectl exec -it cockroachdb-0 -n trading-platform -- \
  ./cockroach sql --insecure \
  --host=cockroachdb-public.trading-platform.svc.cluster.local:26257 \
  -e "SELECT 1;"

