import React, { useState } from "react";
import { createInstitutionalAccount } from "../../api/client";

const AccountCreationCard = () => {
  const [form, setForm] = useState({
    legalEntityName: "",
    primaryContact: "",
    workEmail: "",
    jurisdiction: "",
    aum: "",
    primaryAssetFocus: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("pending");
    try {
      await createInstitutionalAccount(form);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Account creation</div>
          <div className="card-sub">Institutional‑grade onboarding with risk, limits, and ledger segregation.</div>
        </div>
      </div>

      <form className="account-form" onSubmit={handleSubmit}>
        <div>
          <div className="field-label">Legal entity name</div>
          <input
            className="field-input"
            type="text"
            placeholder="e.g. Bassteck Capital LLP"
            required
            value={form.legalEntityName}
            onChange={handleChange("legalEntityName")}
          />
        </div>

        <div className="field-row">
          <div style={{ flex: 1 }}>
            <div className="field-label">Primary contact</div>
            <input
              className="field-input"
              type="text"
              placeholder="Full name"
              required
              value={form.primaryContact}
              onChange={handleChange("primaryContact")}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label">Work email</div>
            <input
              className="field-input"
              type="email"
              placeholder="name@firm.com"
              required
              value={form.workEmail}
              onChange={handleChange("workEmail")}
            />
          </div>
        </div>

        <div className="field-row">
          <div style={{ flex: 1 }}>
            <div className="field-label">Jurisdiction</div>
            <input
              className="field-input"
              type="text"
              placeholder="e.g. UK, EU, UAE"
              value={form.jurisdiction}
              onChange={handleChange("jurisdiction")}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label">AUM / trading size</div>
            <input
              className="field-input"
              type="text"
              placeholder="e.g. 25M, 100M+"
              value={form.aum}
              onChange={handleChange("aum")}
            />
          </div>
        </div>

        <div>
          <div className="field-label">Primary asset focus</div>
          <input
            className="field-input"
            type="text"
            placeholder="Crypto, FX, equities, ETFs, or multi‑asset"
            value={form.primaryAssetFocus}
            onChange={handleChange("primaryAssetFocus")}
          />
        </div>

        <button className="btn-primary" type="submit" disabled={status === "pending"}>
          {status === "pending" ? "Submitting..." : "Initiate institutional onboarding"}
        </button>

        <div className="compliance-note">
          By initiating onboarding, you confirm you are acting on behalf of a professional or institutional client.
          Final onboarding is subject to KYC/AML, suitability, and regulatory checks. GlobalQuantX does not accept
          retail clients.
        </div>

        {status === "success" && (
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--success)" }}>
            Onboarding request received. A member of the desk will contact you.
          </div>
        )}
        {status === "error" && (
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--danger)" }}>
            Something went wrong. Please retry or contact the desk.
          </div>
        )}
      </form>
    </section>
  );
};

export default AccountCreationCard;

