import { useSearchParams } from "react-router-dom";

export default function Login() {
  const [params] = useSearchParams();
  const expired = params.get("expired");

  return (
    <div className="login-page">
      {expired && (
        <div className="session-expired-banner">
          Your session has expired. Please log in again.
        </div>
      )}

      {/* existing login form */}
    </div>
  );
}

