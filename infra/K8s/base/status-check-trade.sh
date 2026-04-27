#!/bin/bash

echo "💹 Trade Platform — Pod Status"
echo "------------------------------"
kubectl get pods -n trade-platform -o wide

