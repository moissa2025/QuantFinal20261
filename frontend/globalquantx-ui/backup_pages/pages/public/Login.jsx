import DockablePanel from "../../layout/DockablePanel.jsx";
import { useSearchParams } from "react-router-dom";

export default function Login() {
  const [params] = useSearchParams(    </DockablePanel>
  );
  const expired = params.get("expired"    </DockablePanel>
  );

  return (
    <div className="login-page">
      {expired && (
        <div className="session-expired-banner">
          Your session has expired. Please log in again.

      )}

      {/* existing login form */}

</DockablePanel>
  );
}

