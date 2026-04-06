# ============================
# Stage 1: Builder (Nightly + MUSL)
# ============================
FROM rust:1.80-slim-bullseye AS builder

WORKDIR /app

# Install MUSL toolchain + build deps
RUN apt-get update && apt-get install -y \
    musl-tools \
    musl-dev \
    build-essential \
    pkg-config \
    libssl-dev \
    clang \
    cmake \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install nightly (needed for edition2024 crates)
RUN rustup toolchain install nightly && rustup default nightly

# Add MUSL targets
RUN rustup target add aarch64-unknown-linux-musl x86_64-unknown-linux-musl

ENV SQLX_OFFLINE=true

COPY . .

# Build static binary
RUN cargo +nightly build --release --target aarch64-unknown-linux-musl -p market-data-service


# ============================
# Stage 2: Runtime (scratch)
# ============================
FROM scratch

WORKDIR /app

COPY --from=builder /app/target/aarch64-unknown-linux-musl/release/market-data-service /app/market-data-service
COPY root.crt /app/root.crt

ENV SSL_CERT_FILE=/app/root.crt
ENV RUST_LOG=info

ENTRYPOINT ["/app/market-data-service"]

