pub fn build_activation_email(email: &str, token: &str) -> (String, String) {
    let subject = "Activate your GlobalQuantX account".to_string();
    let link = format!("https://globalquantx.com/public/activate?token={}", token);
    let body = format!(
        "Hi,\n\nPlease activate your GlobalQuantX account by clicking the link below:\n\n{}\n\nIf you did not request this, you can ignore this email.\n\nGlobalQuantX",
        link
    );
    (subject, body)
}

