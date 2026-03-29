import React from "react";

export default function Login() {
  return (
    <main className="login">
      <h1>Sign In</h1>
      <p>Institutional access to the GlobalQuantX platform.</p>

      <form className="auth-form">
        <label>Email</label>
        <input type="email" placeholder="you@institution.com" />

        <label>Password</label>
        <input type="password" />

        <button>Sign In</button>
      </form>

      <section className="register">
        <h3>New to GlobalQuantX?</h3>
        <button>Request Institutional Access</button>
      </section>
    </main>
  );
}
