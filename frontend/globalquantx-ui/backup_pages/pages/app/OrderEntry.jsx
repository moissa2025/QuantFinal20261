import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";
import Page from "../../components/layout/Page";
import { placeOrder } from "../../api/trading";
import { preTradeCheck } from "../../api/risk";

export default function OrderEntry() {
  const [symbol, setSymbol] = useState("BTCUSD"    </DockablePanel>
  );
  const [size, setSize] = useState(1    </DockablePanel>
  );
  const [side, setSide] = useState("buy"    </DockablePanel>
  );
  const [status, setStatus] = useState(""    </DockablePanel>
  );

  async function submitOrder() {
    setStatus("Running risk checks..."    </DockablePanel>
  );

    try {
      await preTradeCheck({ symbol, size, side }    </DockablePanel>
  );
      setStatus("Risk OK. Placing order..."    </DockablePanel>
  );

      await placeOrder({ symbol, size, side }    </DockablePanel>
  );
      setStatus("Order placed successfully!"    </DockablePanel>
  );
    } catch (err) {
      setStatus("Error: " + err.message    </DockablePanel>
  );
    }
  }

  return (
    <Page title="Trading Terminal">
      {/* form */}
</Page>
</DockablePanel>
  );
}

