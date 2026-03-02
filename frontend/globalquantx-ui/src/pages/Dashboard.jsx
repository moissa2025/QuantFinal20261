import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const onboardingComplete = false; // later replaced with real backend flag

  return (
    <div className="dashboard-page">

      {/* ONBOARDING STATUS BANNER */}
      {!onboardingComplete && (
        <div className="onboarding-banner">
          <span>Institutional onboarding incomplete — trading is locked.</span>
          <Link to="/institution/onboarding">Complete onboarding →</Link>
        </div>
      )}

      <h1 className="dashboard-title">Dashboard</h1>

      <p className="dashboard-sub">
        Welcome to GlobalQuantX — your institutional multi‑asset execution desk.
      </p>

      {/* Add dashboard widgets here */}
    </div>
  );
};

export default Dashboard;

