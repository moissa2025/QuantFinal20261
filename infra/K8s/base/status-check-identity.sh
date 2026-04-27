#!/bin/bash

echo "📡 Trading Platform — Pod Status"
echo "--------------------------------"
kubectl get pods -n trading-platform -o wide

