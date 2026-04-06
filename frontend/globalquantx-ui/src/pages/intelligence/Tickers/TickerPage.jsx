import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IntelligenceLayout from "../IntelligenceLayout";

export default function TickerPage() {
  const { symbol } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/intelligence/tickers/${symbol}`)
      .then(res => res.json())
      .then(setData);
  }, [symbol]);

  if (!data) {
    return (
      <IntelligenceLayout>
        <p>Loading {symbol}…</p>
      </IntelligenceLayout>
    );
  }

  const { asset, quote, quant, news, articles } = data;

  return (
    <IntelligenceLayout>
      <section className="gqx-intel-section">
        <h1>{asset.symbol} — {asset.name}</h1>
        <p className="gqx-intel-subtitle">
          {asset.asset_class.toUpperCase()} · {asset.exchange} · {asset.currency}
        </p>

        <div className="gqx-intel-ticker-top">
          <div className="gqx-intel-ticker-price">
            <h2>{quote.price}</h2>
            <p className={quote.changePct >= 0 ? "gqx-up" : "gqx-down"}>
              {quote.changeAbs} ({quote.changePct}%)
            </p>
          </div>
          <div className="gqx-intel-ticker-quant">
            <h4>GX Quant Score</h4>
            <p className="gqx-intel-quant-score">{quant.score}</p>
            <p className="gqx-intel-quant-label">{quant.label}</p>
            <p className="gqx-intel-quant-expl">{quant.explanation}</p>
          </div>
        </div>
      </section>

      <section className="gqx-intel-section">
        <h2>Recent News</h2>
        <div className="gqx-intel-news-list">
          {news.map(n => (
            <div key={n.id} className="gqx-intel-news-card">
              <h3>{n.headline}</h3>
              <p>{n.summary}</p>
              <a href={n.url} target="_blank">Source</a>
            </div>
          ))}
        </div>
      </section>

      <section className="gqx-intel-section">
        <h2>Research</h2>
        <div className="gqx-intel-news-list">
          {articles.map(a => (
            <a
              key={a.slug}
              href={`/intelligence/research/${a.slug}`}
              className="gqx-intel-news-card"
            >
              <h3>{a.title}</h3>
              <p>{a.summary}</p>
            </a>
          ))}
        </div>
      </section>
    </IntelligenceLayout>
  );
}

