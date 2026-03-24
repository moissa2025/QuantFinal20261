export default function Portfolio() {
  return (
    <div className="portfolio-container">

      {/* TOP METRICS */}
      <div className="portfolio-row">
        <div className="portfolio-card">
          <h3>Total Portfolio Value</h3>
          <div className="metric">$1,248,920</div>
        </div>

        <div className="portfolio-card">
          <h3>Daily PnL</h3>
          <div className="metric positive">+ $12,430</div>
        </div>

        <div className="portfolio-card">
          <h3>Unrealized PnL</h3>
          <div className="metric positive">+ $8,210</div>
        </div>

        <div className="portfolio-card">
          <h3>Realized PnL</h3>
          <div className="metric positive">+ $42,900</div>
        </div>
      </div>

      {/* ALLOCATION + PERFORMANCE */}
      <div className="portfolio-row">
        <div className="portfolio-chart">
          <h3>Asset Allocation</h3>
          <div className="chart-placeholder">[ Allocation Chart Placeholder ]</div>
        </div>

        <div className="portfolio-chart">
          <h3>Performance</h3>
          <div className="chart-placeholder">[ Performance Chart Placeholder ]</div>
        </div>
      </div>

      {/* HOLDINGS TABLE */}
      <div className="portfolio-table">
        <h3>Holdings</h3>

        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Quantity</th>
              <th>Avg Entry</th>
              <th>Mark Price</th>
              <th>Unrealized PnL</th>
              <th>Realized PnL</th>
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
            </tr>

            <tr>
              <td>ETH/USD</td>
              <td>4.0</td>
              <td>3,120</td>
              <td>3,420</td>
              <td className="positive">+ 1,200</td>
              <td className="positive">+ 4,800</td>
            </tr>

            <tr>
              <td>AAPL</td>
              <td>20</td>
              <td>172.10</td>
              <td>187.40</td>
              <td className="positive">+ 305</td>
              <td className="positive">+ 1,100</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

