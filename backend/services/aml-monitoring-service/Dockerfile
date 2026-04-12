# ============================
# Stage 1 — Builder
# ============================
FROM rust:latest AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    clang \
    cmake \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

ENV SQLX_OFFLINE=false

# Copy full workspace (Cargo workspace requires full structure)
COPY services ./services
COPY Cargo.toml .
COPY libs ./libs
COPY .sqlx ./.sqlx

# Copy CockroachDB CA cert

# Build only this service
WORKDIR /app/backend/services/aml-monitoring-service
RUN cargo build --release -p aml-monitoring-service

# ============================
# Stage 2 — Runtime
# ============================
FROM debian:bookworm-slim AS runtime

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl-dev \
    libpq5 \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/release/aml-monitoring-service /app/aml-monitoring-service


ENV RUST_LOG=info

CMD ["/app/aml-monitoring-service"]

