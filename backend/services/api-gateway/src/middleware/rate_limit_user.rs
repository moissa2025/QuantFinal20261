use std::time::{Duration, Instant};

use axum::{
    body::Body,
    http::{Request, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
};
use dashmap::DashMap;

#[derive(Clone)]
pub struct UserRateLimiter {
    buckets: DashMap<String, Bucket>,
    capacity: u32,
    refill_amount: u32,
    refill_interval: Duration,
}

#[derive(Clone)]
struct Bucket {
    tokens: u32,
    last_refill: Instant,
}

impl UserRateLimiter {
    pub fn new() -> Self {
        Self {
            buckets: DashMap::new(),
            capacity: 20,
            refill_amount: 20,
            refill_interval: Duration::from_secs(1),
        }
    }

    pub fn check(&self, user_id: &str) -> bool {
        let mut bucket = self.buckets.entry(user_id.to_string())
            .or_insert(Bucket {
                tokens: self.capacity,
                last_refill: Instant::now(),
            });

        let now = Instant::now();
        if now.duration_since(bucket.last_refill) >= self.refill_interval {
            bucket.tokens = self.capacity;
            bucket.last_refill = now;
        }

        if bucket.tokens > 0 {
            bucket.tokens -= 1;
            true
        } else {
            false
        }
    }
}

pub async fn per_user_rate_limit(
    req: Request<Body>,
    next: Next,
) -> Response {
    let user_id = req
        .extensions()
        .get::<crate::identity::Identity>()
        .map(|id| id.user_id.clone())
        .unwrap_or_else(|| "anonymous".to_string());

    let limiter = req
        .extensions()
        .get::<UserRateLimiter>()
        .expect("UserRateLimiter missing from state");

    if !limiter.check(&user_id) {
        return (StatusCode::TOO_MANY_REQUESTS, "Too Many Requests").into_response();
    }

    next.run(req).await
}

