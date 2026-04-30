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

# Copy the ENTIRE workspace (required for Cargo workspace builds)
COPY ../../Cargo.toml ../../Cargo.lock ./
COPY ../../services ./services
COPY ../../libs ./libs
COPY ../../.sqlx ./.sqlx

# Build only this service
WORKDIR /app/services/intelligence-service
RUN cargo build --release -p intelligence-service

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

COPY --from=builder /app/target/release/intelligence-service /app/intelligence-service

ENV RUST_LOG=info

CMD ["/app/intelligence-service"]

