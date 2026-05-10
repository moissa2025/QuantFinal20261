kubectl exec -it cockroachdb-0 -n trading-platform -- \
  ./cockroach init --insecure \
  --host=cockroachdb-0.cockroachdb.trading-platform.svc.cluster.local:26257
