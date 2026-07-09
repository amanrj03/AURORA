import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

// 1. Define Zod validation schema for the investment report
const investmentAnalysisSchema = z.object({
  decision: z.enum(['Invest', 'Pass']).describe('Final investment recommendation decision'),
  confidence: z.number().min(0).max(1).describe('Confidence score between 0 and 1 representing decision strength'),
  summary: z.string().describe('Executive summary paragraph of the audit findings and company state'),
  positives: z.array(z.string()).describe('List of positive financial, solvency, or market growth factors'),
  negatives: z.array(z.string()).describe('List of negative financial risks, valuation concerns, or structural drags'),
  transcript: z.string().describe('Detailed markdown reasoning report covering financials, solvency, valuation ratios, and news grounding')
});

/**
 * Runs the AI Investment Analyst Agent on the company's financial and news data.
 * Uses 100% idiomatic LangChain LCEL (LangChain Expression Language) pipes and structured outputs.
 */
export async function runInvestmentAnalysis({
  companyName,
  metrics,
  news,
  riskTolerance = 'med'
}) {
  const modelKey = process.env.GEMINI_API_KEY;

  if (!modelKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server .env file.');
  }

  // 2. Initialize Gemini Chat Model using LangChain
  const model = new ChatGoogleGenerativeAI({
    apiKey: modelKey,
    model: 'gemini-2.5-flash', // Correct parameter key for this library version
    temperature: 0.1, // Lower temperature for analytical and deterministic precision
  });

  // 3. Bind structured output schema to the model (forces API-level JSON structure)
  const structuredModel = model.withStructuredOutput(investmentAnalysisSchema);

  // 4. Design Prompt Template using ChatPromptTemplate
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a Senior Investment Research Analyst and Compliance Auditor at a prestige venture capital firm.
Your job is to audit a company's financial metrics and news context, and make an objective, data-grounded recommendation: Invest or Pass.

You must evaluate the company against the selected Risk Tolerance Level:
- LOW (Conservative): Risk-averse. Focus heavily on low debt (Debt-to-Equity < 50%), solid current ratios (> 1.5), strong operating margins, and steady profitability. Pass on speculative valuations, extremely high P/E ratios, or negative cash flows.
- MED (Balanced): Balanced growth. Growth is welcome, but must be backed by healthy free cash flows and reasonable P/E / PEG valuations.
- HIGH (Speculative): Growth-oriented. High top-line growth, AI market adoption, and strong technology catalysts can offset high P/E multiples or leverage.

Risk Guideline Context: The user selected a '{riskTolerance}' risk tolerance level. Ensure your analysis complies strictly with this mandate.`
    ],
    [
      'human',
      `Please analyze the following retrieved data:

Company Name: {companyName}
Ticker: {ticker}

Financial Metrics:
{metricsBlock}

Recent Grounded News Headlines & Scraped Snips:
{newsBlock}

Perform a deep analysis, weigh all pros and cons, and return the structured audit output.`
    ]
  ]);

  // 5. Compose LCEL (LangChain Expression Language) Chain
  const chain = prompt.pipe(structuredModel);

  // 6. Invoke the pipeline
  try {
    const metricsBlock = Object.entries(metrics)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n');

    const newsBlock = news.length > 0
      ? news.map((n, i) => `[${i + 1}] ${n.title} (${n.publisher || 'Web'}): ${n.text || 'No scraped text body available.'}`).join('\n\n')
      : 'No recent news articles were resolved for this company.';

    const responseObj = await chain.invoke({
      riskTolerance,
      companyName,
      ticker: metrics.ticker || 'N/A',
      metricsBlock,
      newsBlock
    });

    return {
      decision: responseObj.decision,
      confidence: String(responseObj.confidence),
      summary: responseObj.summary,
      positives: responseObj.positives,
      negatives: responseObj.negatives,
      transcript: responseObj.transcript
    };

  } catch (err) {
    console.error('[LangChain Pipeline] Execution failed:', err);
    throw err;
  }
}
