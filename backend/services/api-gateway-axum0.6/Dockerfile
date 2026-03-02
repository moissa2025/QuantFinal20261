FROM rust:1.75 as builder

WORKDIR /app
COPY ../../.. .

RUN cargo build --release --bin api-gateway

FROM debian:bookworm-slim
WORKDIR /app

COPY --from=builder /app/target/release/api-gateway .

CMD ["./api-gateway"]

