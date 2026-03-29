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

# Copy workspace files
COPY Cargo.toml Cargo.lock ./
COPY .sqlx ./.sqlx
COPY libs ./libs
COPY services ./services

COPY root.crt /app/root.crt

# Build only this service
RUN cargo build --release -p api-gateway


# ============================
# Stage 2 — Runtime
# ============================
FROM debian:stable-slim AS runtime

# Install CA certificates + DNS resolver libraries
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

# Expose port
EXPOSE 8080

# Run the binary
CMD ["/app/api-gateway"]

