import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function ExecutionAttribution() {
  const [orderId, setOrderId] = useState(""    </DockablePanel>
  );

  return (
    <div className="ea-container">

      <div className="ea-header">
        <h1>Execution Alpha Attribution</h1>
        <p>Slippage, routing, timing, and execution diagnostics.</p>


      {/* INPUT */}
      <div className="ea-panel">
        <h2>Order ID</h2>

        <input
          className="ea-input"
          type="text"
          placeholder="e.g. EX12345"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />


      {/* ATTRIBUTION */}
      <div className="ea-panel">
        <h2>Alpha Attribution</h2>

        <pre className="ea-block">
{`Slippage Alpha:      +$4.20
Routing Alpha:        +$2.80
Timing Alpha:         +$1.40

Total Execution Alpha: +$8.40`}
        </pre>


      {/* BREAKDOWN */}
      <div className="ea-panel">
        <h2>Execution Breakdown</h2>

        <pre className="ea-block">
{`Market Impact:       -$6.20
Spread Cost:          -$3.40
Routing Benefit:      +$4.80
Timing Benefit:       +$3.20`}
        </pre>


      {/* LOG */}
      <div className="ea-panel">
        <h2>Attribution Log</h2>

        <ul className="ea-log">
          <li>Order loaded</li>
          <li>Slippage computed</li>
          <li>Routing alpha calculated</li>
          <li>Timing alpha estimated</li>
        </ul>



</DockablePanel>
  );
}

