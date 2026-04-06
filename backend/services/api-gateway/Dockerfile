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

ENV SQLX_OFFLINE=true

# Copy full workspace (Cargo workspace requires full structure)
COPY backend ./backend
COPY Cargo.toml .
COPY Cargo.lock .
COPY .sqlx ./.sqlx

# Copy CockroachDB CA cert
COPY root.crt /app/root.crt

# Build only this service
WORKDIR /app/backend/services/api-gateway
RUN cargo build --release -p api-gateway

# ============================
# Stage 2 — Runtime
# ============================
FROM debian:stable-slim AS runtime

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl-dev \
    libpq5 \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/release/api-gateway /app/api-gateway

# Copy CockroachDB Cloud CA cert
COPY --from=builder /app/root.crt /app/root.crt

EXPOSE 8080

CMD ["/app/api-gateway"]

