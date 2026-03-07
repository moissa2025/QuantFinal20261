import { useState } from "react";
import Page from "../../components/layout/Page";
import { placeOrder } from "../../api/trading";
import { preTradeCheck } from "../../api/risk";

export default function OrderEntry() {
  const [symbol, setSymbol] = useState("BTCUSD");
  const [size, setSize] = useState(1);
  const [side, setSide] = useState("buy");
  const [status, setStatus] = useState("");

  async function submitOrder() {
    setStatus("Running risk checks...");

    try {
      await preTradeCheck({ symbol, size, side });
      setStatus("Risk OK. Placing order...");

      await placeOrder({ symbol, size, side });
      setStatus("Order placed successfully!");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  return (
    <Page title="Trading Terminal">
      {/* form */}
    </Page>
  );
}

