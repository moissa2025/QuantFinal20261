# ============================
# Stage 1: Builder (Stable Bullseye + Nightly via rustup)
# ============================
FROM rust:1.80-slim-bullseye AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    clang \
    cmake \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install nightly toolchain manually
RUN rustup toolchain install nightly && rustup default nightly

ENV SQLX_OFFLINE=true

# Copy workspace
COPY . .

# Build using nightly
RUN cargo +nightly build --release -p market-data-service


# ============================
# Stage 2: Runtime (Bullseye)
# ============================
FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/market-data-service /app/market-data-service
COPY root.crt /app/root.crt

ENV SSL_CERT_FILE=/app/root.crt
ENV RUST_LOG=info

CMD ["/app/market-data-service"]

