async function getGXBriefs(limit = 12) {
  const news = await db.newsItem.findMany({
    orderBy: { published_at: "desc" },
    take: limit,
  });

  return news.map(n => ({
    id: n.id,
    headline: n.headline_variant,
    summary: n.summary_ai,
    sentiment: n.sentiment_label,
    assets: n.tags_assets || [],
    themes: n.tags_themes || [],
    published_at: n.published_at
  }));
}

