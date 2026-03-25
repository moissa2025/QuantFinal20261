import DockablePanel from "../../layout/DockablePanel.jsx";
export default function Positions() {
  return (
    <div className="positions-container">

      {/* TOP SUMMARY */}
      <div className="positions-row">
        <div className="positions-card">
          <h3>Total Exposure</h3>
          <div className="metric">$842,000</div>


        <div className="positions-card">
          <h3>Net PnL</h3>
          <div className="metric positive">+ $51,110</div>


        <div className="positions-card">
          <h3>Open Positions</h3>
          <div className="metric">14</div>


        <div className="positions-card">
          <h3>Risk Level</h3>
          <div className="metric warning">Moderate</div>



      {/* POSITIONS TABLE */}
      <div className="positions-table">
        <h3>Open Positions</h3>

        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Size</th>
              <th>Avg Entry</th>
              <th>Mark Price</th>
              <th>Unrealized PnL</th>
              <th>Realized PnL</th>
              <th>Exposure</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>BTC/USD</td>
              <td>0.50</td>
              <td>62,400</td>
              <td>68,200</td>
              <td className="positive">+ 2,900</td>
              <td className="positive">+ 12,000</td>
              <td>$34,100</td>
            </tr>

            <tr>
              <td>ETH/USD</td>
              <td>4.0</td>
              <td>3,120</td>
              <td>3,420</td>
              <td className="positive">+ 1,200</td>
              <td className="positive">+ 4,800</td>
              <td>$13,680</td>
            </tr>

            <tr>
              <td>AAPL</td>
              <td>20</td>
              <td>172.10</td>
              <td>187.40</td>
              <td className="positive">+ 305</td>
              <td className="positive">+ 1,100</td>
              <td>$3,748</td>
            </tr>
          </tbody>
        </table>


      {/* EXPOSURE BREAKDOWN */}
      <div className="positions-row">
        <div className="positions-panel">
          <h3>Exposure Breakdown</h3>
          <div className="chart-placeholder">[ Exposure Chart Placeholder ]</div>


        <div className="positions-panel">
          <h3>Risk Metrics</h3>
          <ul className="risk-list">
            <li>VaR (95%): $12,400</li>
            <li>Max Drawdown: 4.2%</li>
            <li>Leverage: 2.1x</li>
            <li>Beta: 1.12</li>
          </ul>




</DockablePanel>
  );
}

