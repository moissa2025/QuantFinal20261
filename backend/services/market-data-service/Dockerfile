# Stage 1: builder
FROM --platform=linux/amd64 rust:latest as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    clang \
    cmake \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the entire workspace
COPY . .

# Build only this service
RUN cargo build --release -p market-data-service

# Stage 2: runtime
FROM --platform=linux/amd64 debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/market-data-service /app/market-data-service

ENV RUST_LOG=info

CMD ["/app/market-data-service"]

