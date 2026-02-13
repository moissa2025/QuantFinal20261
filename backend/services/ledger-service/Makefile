# -----------------------------
# Local Alembic Commands
# -----------------------------

# Apply all migrations locally
migrate-local:
	alembic upgrade head

# Create a new migration
revision:
	alembic revision --autogenerate -m "$(m)"

# -----------------------------
# Kubernetes Migration Commands
# -----------------------------

# Apply Alembic migrations in Kubernetes
migrate-k8s:
	kubectl apply -f k8s/ledger-migrations.yaml
	kubectl wait --for=condition=complete job/ledger-migrations -n <namespace>

# Clean up old migration jobs
clean-migration-job:
	kubectl delete job ledger-migrations -n <namespace> --ignore-not-found=true

