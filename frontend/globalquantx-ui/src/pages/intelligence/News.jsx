import React, { useEffect, useState } from "react";
import IntelligenceLayout from "./IntelligenceLayout";

export default function News() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/intelligence/news")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <IntelligenceLayout>
      <h1>Latest News</h1>

      <div className="gqx-intel-news-list">
        {items.map(n => (
          <div key={n.id} className="gqx-intel-news-card">
            <h3>{n.headline}</h3>
            <p>{n.summary_ai}</p>
            <a href={n.url} target="_blank">Source</a>
          </div>
        ))}
      </div>
    </IntelligenceLayout>
  );
}

