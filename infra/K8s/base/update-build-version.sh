find . -type f -name "deployment.yaml" -exec sed -i '' 's/v0\.[0-9A-Za-z_.-]*/v0.2.7/g' {} +
