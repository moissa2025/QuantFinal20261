import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IntelligenceLayout from "../IntelligenceLayout";

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`/api/intelligence/research/${slug}`)
      .then(res => res.json())
      .then(setArticle);
  }, [slug]);

  if (!article) {
    return (
      <IntelligenceLayout>
        <p>Loading research…</p>
      </IntelligenceLayout>
    );
  }

  return (
    <IntelligenceLayout>
      <article className="gqx-intel-article">
        <h1>{article.title}</h1>
        <p className="gqx-intel-subtitle">
          {article.subtitle || article.summary}
        </p>

        <div className="gqx-intel-article-meta">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.published_at}</span>
        </div>

        {article.summary && (
          <div className="gqx-intel-article-tldr">
            <h4>GX Summary</h4>
            <p>{article.summary}</p>
          </div>
        )}

        <div
          className="gqx-intel-article-body"
          dangerouslySetInnerHTML={{ __html: article.body_html }}
        />

        {article.assets?.length > 0 && (
          <div className="gqx-intel-article-assets">
            <h4>Related Assets</h4>
            <div className="gqx-intel-tags">
              {article.assets.map(s => (
                <a key={s} href={`/intelligence/tickers/${s}`}>{s}</a>
              ))}
            </div>
          </div>
        )}
      </article>
    </IntelligenceLayout>
  );
}

