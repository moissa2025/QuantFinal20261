let mut sub = state.nats.with_subscriber("wallet.*").await.unwrap();

