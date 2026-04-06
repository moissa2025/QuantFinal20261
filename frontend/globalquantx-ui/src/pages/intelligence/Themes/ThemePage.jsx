import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IntelligenceLayout from "../IntelligenceLayout";

export default function ThemePage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/intelligence/themes/${slug}`)
      .then(res => res.json())
      .then(setData);
  }, [slug]);

  if (!data) {
    return (
      <IntelligenceLayout>
        <p>Loading theme…</p>
      </IntelligenceLayout>
    );
  }

  const { theme, assets, news, articles } = data;

  return (
    <IntelligenceLayout>
      <section className="gqx-intel-section">
        <h1>{theme.name}</h1>
        <p className="gqx-intel-subtitle">
          {theme.description}
        </p>

        <h3>Key Assets</h3>
        <div className="gqx-intel-market-grid">
          {assets.map(a => (
            <a
              key={a.symbol}
              href={`/intelligence/tickers/${a.symbol}`}
              className="gqx-intel-market-card"
            >
              <h4>{a.symbol}</h4>
              <p>{a.price}</p>
              <p className={a.changePct >= 0 ? "gqx-up" : "gqx-down"}>
                {a.changePct}%
              </p>
            </a>
          ))}
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

