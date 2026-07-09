export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(200).json([]);
  }

  const query = q.trim();

  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=6`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      return res.status(200).json([]);
    }

    const data = await response.json();
    const suggestions = (data.quotes || [])
      .filter(item => item.symbol && (item.shortname || item.longname))
      .map(item => ({
        symbol: item.symbol,
        name: item.longname || item.shortname,
        exchange: item.exchange || "EQUITY",
        type: item.quoteType || "EQUITY"
      }));

    return res.status(200).json(suggestions);
  } catch (error) {
    console.error("[Autocomplete API Error]:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
