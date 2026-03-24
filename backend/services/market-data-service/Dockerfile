# Stage 1: builder
FROM rust:latest AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y     build-essential     pkg-config     libssl-dev     clang     cmake     libpq-dev     && rm -rf /var/lib/apt/lists/*

ENV SQLX_OFFLINE=true

# Copy workspace files
COPY Cargo.toml Cargo.lock ./
COPY .sqlx ./.sqlx
COPY libs ./libs
COPY services ./services
COPY root.crt /app/root.crt

# Build only this service
RUN cargo build --release -p market-data-service

# Stage 2: runtime
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/market-data-service /app/market-data-service
COPY root.crt /app/root.crt

ENV SSL_CERT_FILE=/app/root.crt
ENV RUST_LOG=info

CMD ["/app/market-data-service"]
