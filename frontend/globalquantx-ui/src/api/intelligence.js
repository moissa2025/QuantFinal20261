router.get("/intelligence/home", async (req, res) => {
  const briefs = await ContentService.getGXBriefs(12);
  const markets = await MarketService.getSnapshot();
  res.json({ briefs, markets });
});

