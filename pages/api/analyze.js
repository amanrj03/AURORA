import { searchCompany, getFinancialMetrics, scrapeArticleText } from '../../lib/yahooFinance';
import { runInvestmentAnalysis } from '../../lib/investAgent';

// Bypass TLS/SSL certificate verification errors (useful for corporate proxy / local self-signed certificate environments)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { company, riskTolerance = 'med' } = req.body || {};

  if (!company || typeof company !== 'string' || !company.trim()) {
    return res.status(400).json({ error: 'Company name or ticker is required' });
  }

  const query = company.trim();

  try {
    // Step 1: Search and resolve ticker
    console.log(`[API Analyze] Resolving ticker for query: "${query}"...`);
    const searchResult = await searchCompany(query);
    
    if (!searchResult.ticker) {
      return res.status(404).json({
        error: `Could not resolve company "${query}" to a ticker. Please try a different name or use an exact stock ticker (e.g. AAPL, TSLA).`
      });
    }
    
    const ticker = searchResult.ticker;
    const companyName = searchResult.name || query;
    console.log(`[API Analyze] Resolved ticker: ${ticker} (${companyName})`);

    // Step 2: Fetch detailed financials
    console.log(`[API Analyze] Fetching financials for: ${ticker}...`);
    const financialData = await getFinancialMetrics(ticker);

    // Step 3: Fetch news articles and scrape contents concurrently
    console.log(`[API Analyze] Retrieving news articles and scraping text for grounding...`);
    const newsArticles = searchResult.news || [];
    const limitedNews = newsArticles.slice(0, 3); // Scrape top 3 articles to stay within time/rate limits

    const newsWithScrapedContent = await Promise.all(
      limitedNews.map(async (article) => {
        try {
          if (article.link) {
            const content = await scrapeArticleText(article.link);
            return {
              ...article,
              scrapedText: content || null
            };
          }
        } catch (scrapeErr) {
          console.warn(`[API Analyze] Scrape warning for ${article.link}:`, scrapeErr.message);
        }
        return {
          ...article,
          scrapedText: null
        };
      })
    );

    // Step 4: Run AI analysis agent
    console.log('[API Analyze] Invoking Gemini AI analyst agent...');
    const analysis = await runInvestmentAnalysis({
      companyName,
      metrics: financialData,
      news: newsWithScrapedContent,
      riskTolerance
    });

    // Step 5: Format and return the result
    const responsePayload = {
      id: `analysis-${Date.now()}`,
      company: companyName,
      ticker,
      exchange: searchResult.exchange || financialData.exchange,
      price: financialData.price,
      priceFmt: financialData.priceFmt,
      currency: financialData.currency,
      sector: financialData.sector,
      industry: financialData.industry,
      website: financialData.website,
      businessSummary: financialData.summary,
      metrics: {
        peRatio: financialData.peRatioFmt,
        forwardPE: financialData.forwardPEFmt,
        pegRatio: financialData.pegRatioFmt,
        priceToBook: financialData.priceToBookFmt,
        trailingEps: financialData.trailingEpsFmt,
        forwardEps: financialData.forwardEpsFmt,
        profitMargin: financialData.profitMarginFmt,
        operatingMargin: financialData.operatingMarginFmt,
        freeCashFlow: financialData.freeCashFlowFmt,
        debtToEquity: financialData.debtToEquityFmt,
        currentRatio: financialData.currentRatioFmt,
        revenueGrowth: financialData.revenueGrowthFmt,
        totalRevenue: financialData.totalRevenueFmt
      },
      recommendationTrend: financialData.recommendations,
      decision: analysis.decision,
      confidence: analysis.confidence,
      summary: analysis.summary,
      positives: analysis.positives,
      negatives: analysis.negatives,
      sources: limitedNews.map(n => ({
        title: n.title,
        publisher: n.publisher,
        link: n.link
      })),
      transcript: analysis.transcript
    };

    console.log(`[API Analyze] Analysis completed successfully for ${ticker}. Verdict: ${analysis.decision}`);
    return res.status(200).json(responsePayload);

  } catch (err) {
    console.error('[API Analyze] Route failed with error:', err);
    let errorMsg = 'An internal error occurred during the investment research pipeline.';
    
    const isRateLimit = err.status === 429 || err.statusCode === 429 || 
      (err.message && (err.message.includes('429') || err.message.toLowerCase().includes('quota') || err.message.toLowerCase().includes('rate limit')));
      
    const isOverloaded = err.status === 503 || err.statusCode === 503 || 
      (err.message && (err.message.includes('503') || err.message.toLowerCase().includes('service unavailable') || err.message.toLowerCase().includes('high demand')));

    if (isRateLimit) {
      errorMsg = 'Gemini API Quota Exceeded (Rate Limited). The free tier has strict limits. Please wait 60 seconds and try again.';
    } else if (isOverloaded) {
      errorMsg = 'Gemini API Service Unavailable (HTTP 503). The model is currently experiencing high demand. Please wait a few seconds and try again.';
    } else if (err.message && (err.message.includes('GoogleGenerativeAI') || err.message.includes('ChatGoogleGenerativeAI') || err.message.includes('FetchError'))) {
      errorMsg = `Gemini API Error: ${err.message}`;
    }

    return res.status(500).json({
      error: errorMsg,
      details: err.message
    });
  }
}
