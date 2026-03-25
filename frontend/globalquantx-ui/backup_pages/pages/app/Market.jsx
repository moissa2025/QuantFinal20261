import DockablePanel from "../../layout/DockablePanel.jsx";
export default function Market() {
  return (
    <div className="market-container">

      {/* TOP ROW: MARKET SNAPSHOT */}
      <div className="market-row">
        <div className="market-card">
          <h3>BTC/USD</h3>
          <div className="market-price">$68,200</div>
          <div className="market-change positive">+ 2.4%</div>


        <div className="market-card">
          <h3>ETH/USD</h3>
          <div className="market-price">$3,420</div>
          <div className="market-change positive">+ 1.8%</div>


        <div className="market-card">
          <h3>AAPL</h3>
          <div className="market-price">$187.40</div>
          <div className="market-change positive">+ 0.9%</div>


        <div className="market-card">
          <h3>TSLA</h3>
          <div className="market-price">$212.10</div>
          <div className="market-change negative">− 1.2%</div>



      {/* MIDDLE ROW: HEATMAP + TOP MOVERS */}
      <div className="market-row">
        <div className="market-panel">
          <h3>Market Heatmap</h3>
          <div className="heatmap-placeholder">[ Heatmap Placeholder ]</div>


        <div className="market-panel">
          <h3>Top Movers</h3>
          <table className="market-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Change</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SOL/USD</td>
                <td className="positive">+ 6.2%</td>
                <td>1.2B</td>
              </tr>
              <tr>
                <td>NVDA</td>
                <td className="positive">+ 4.8%</td>
                <td>820M</td>
              </tr>
              <tr>
                <td>AMZN</td>
                <td className="negative">− 3.1%</td>
                <td>540M</td>
              </tr>
            </tbody>
          </table>



      {/* BOTTOM ROW: MARKET DEPTH + VOLUME LEADERS */}
      <div className="market-row">
        <div className="market-panel">
          <h3>Market Depth</h3>
          <div className="chart-placeholder">[ Depth Chart Placeholder ]</div>


        <div className="market-panel">
          <h3>Volume Leaders</h3>
          <table className="market-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BTC/USD</td>
                <td>2.4B</td>
              </tr>
              <tr>
                <td>ETH/USD</td>
                <td>1.8B</td>
              </tr>
              <tr>
                <td>AAPL</td>
                <td>1.1B</td>
              </tr>
            </tbody>
          </table>




</DockablePanel>
  );
}

