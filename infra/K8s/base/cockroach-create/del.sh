kubectl delete statefulset cockroachdb -n trading-platform --ignore-not-found
kubectl delete svc cockroachdb cockroachdb-public -n trading-platform --ignore-not-found
kubectl delete pvc -n trading-platform --selector=app=cockroachdb --ignore-not-found

