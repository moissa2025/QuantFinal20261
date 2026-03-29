import React from "react";

export default function PublicLogin() {
  return (
    <main className="-public-login">

      <h1>Sign In</h1>
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
    
      <footer className="global-footer">
        <p>
          Alerts: <a href="mailto:alerts@globalquantx.com">alerts@globalquantx.com</a> |
          {" "}Trading Desk: <a href="mailto:trading@globalquantx.com">trading@globalquantx.com</a> |
          {" "}Support: <a href="mailto:support@globalquantx.com">support@globalquantx.com</a>
        </p>

      </footer>
    </main>
  );
}
