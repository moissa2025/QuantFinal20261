#!/bin/bash

echo "🛡️ Compliance Platform — Pod Status"
echo "-----------------------------------"
kubectl get pods -n compliance-platform -o wide

