# ============================
# 1. Build stage
# ============================
FROM rust:1.75 as builder

WORKDIR /app

# Copy workspace
COPY ../../.. .

# Build all required binaries
RUN cargo build --release \
    --bin trading-service \
    --bin market-data-service \
    --bin risk-service \
    --bin ledger-service

# ============================
# 2. Runtime stage
# ============================
FROM debian:bookworm-slim

WORKDIR /app

# Copy binaries
COPY --from=builder /app/target/release/trading-service .
COPY --from=builder /app/target/release/market-data-service .
COPY --from=builder /app/target/release/risk-service .
COPY --from=builder /app/target/release/ledger-service .

# Supervisor script to run all services
COPY run.sh .

RUN chmod +x run.sh

CMD ["./run.sh"]

