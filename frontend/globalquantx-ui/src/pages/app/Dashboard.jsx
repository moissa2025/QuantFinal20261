import { useEffect, useState } from "react";
import Page from "../../components/layout/Page";
import { getProfile } from "../../api/user";
import { getBalances } from "../../api/ledger";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    getProfile().then(setProfile).catch(console.error);
    getBalances().then(setBalances).catch(console.error);
  }, []);

  return (
    <Page title="Dashboard">
      {profile && (
        <section>
          <h2>Welcome, {profile.name}</h2>
          <p>Email: {profile.email}</p>
        </section>
      )}

      <section>
        <h2>Your Balances</h2>
        <ul>
          {balances.map((b) => (
            <li key={b.asset}>
              {b.asset}: {b.amount}
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}

