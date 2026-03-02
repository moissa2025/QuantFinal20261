use serde::Serialize;

#[derive(Serialize)]
pub struct RpcResponse<T> {
    pub ok: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T> RpcResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            ok: true,
            data: Some(data),
            error: None,
        }
    }

    pub fn failure(err: impl ToString) -> Self {
        Self {
            ok: false,
            data: None,
            error: Some(err.to_string()),
        }
    }
}

