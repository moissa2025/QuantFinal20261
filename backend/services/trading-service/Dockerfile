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
COPY Cargo.toml Cargo.lock ./
COPY services ./services
COPY libs ./libs
COPY .sqlx ./.sqlx

# Copy CockroachDB CA cert

# Build only this service
WORKDIR /app/backend/services/trading-service
RUN cargo build --release -p trading-service

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
COPY --from=builder /app/target/release/trading-service /app/trading-service


ENV RUST_LOG=info

CMD ["/app/trading-service"]

