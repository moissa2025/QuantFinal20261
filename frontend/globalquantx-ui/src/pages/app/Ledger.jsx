import { useEffect, useState } from "react";
import Page from "../../components/layout/Page";
import { getTransactions } from "../../api/ledger";

export default function Ledger() {
  const [tx, setTx] = useState([]);

  useEffect(() => {
    getTransactions().then(setTx).catch(console.error);
  }, []);

  return (
    <Page title="Ledger">
      <ul>
        {tx.map((t) => (
          <li key={t.id}>
            {t.type} — {t.amount} {t.asset}
          </li>
        ))}
      </ul>
    </Page>
  );
}

