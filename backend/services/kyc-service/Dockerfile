# Stage 1: builder
FROM rust:latest AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y     build-essential     pkg-config     libssl-dev     clang     cmake     libpq-dev     && rm -rf /var/lib/apt/lists/*

ENV SQLX_OFFLINE=true

# Copy workspace files
COPY Cargo.toml Cargo.lock ./

# Copy shared libs
COPY libs ./libs

# Copy ALL services (workspace members)
COPY services ./services

# Build only this service
RUN cargo build --release -p kyc-service

# Stage 2: runtime
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/kyc-service /app/kyc-service
COPY services/kyc-service/root.crt /app/root.crt

ENV SSL_CERT_FILE=/app/root.crt
ENV RUST_LOG=info

CMD ["/app/kyc-service"]
