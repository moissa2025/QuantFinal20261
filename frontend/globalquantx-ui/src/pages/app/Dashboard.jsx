export default function Dashboard() {
  return (
    <div className="dashboard-container">

      {/* TOP ROW */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <h3>Portfolio Value</h3>
          <div className="metric">$1,248,920</div>
        </div>

        <div className="dashboard-card">
          <h3>Daily PnL</h3>
          <div className="metric positive">+ $12,430</div>
        </div>

        <div className="dashboard-card">
          <h3>Open Positions</h3>
          <div className="metric">14</div>
        </div>

        <div className="dashboard-card">
          <h3>Risk Level</h3>
          <div className="metric warning">Moderate</div>
        </div>
      </div>

      {/* CHART + TABLE */}
      <div className="dashboard-row">
        <div className="dashboard-chart">
          <h3>Portfolio Performance</h3>
          <div className="chart-placeholder">[ Chart Placeholder ]</div>
        </div>

        <div className="dashboard-table">
          <h3>Recent Trades</h3>
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Side</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BTC/USD</td>
                <td>Buy</td>
                <td>0.50</td>
                <td>68,200</td>
                <td>12:41</td>
              </tr>
              <tr>
                <td>ETH/USD</td>
                <td>Sell</td>
                <td>4.0</td>
                <td>3,420</td>
                <td>11:58</td>
              </tr>
              <tr>
                <td>AAPL</td>
                <td>Buy</td>
                <td>20</td>
                <td>187.40</td>
                <td>10:15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

