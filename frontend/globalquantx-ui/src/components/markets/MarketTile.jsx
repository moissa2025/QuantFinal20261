import React from "react";

const MarketTile = ({ symbol, kind, price, changePct, meta }) => {
  const up = changePct >= 0;
  const changeClass = up ? "market-change up" : "market-change down";
  const changeText = `${up ? "+" : ""}${changePct.toFixed(2)}%`;

  return (
    <div className="market-card">
      <div className="market-header">
        <span className="symbol">{symbol}</span>
        <span>{kind.toUpperCase()}</span>
      </div>
      <div className="market-price-row">
        <div className="market-price">{price}</div>
        <div className={changeClass}>{changeText}</div>
      </div>
      <div className="market-meta">
        <span>
          {meta.left.label}: <strong>{meta.left.value}</strong>
        </span>
        <span>
          {meta.right.label}: <strong>{meta.right.value}</strong>
        </span>
      </div>
    </div>
  );
};

export default MarketTile;

