# AI Investment Research Agent — Altuni AI Labs

An autonomous, full-stack AI agent that performs quantitative and qualitative equity research on public companies. It resolves tickers, downloads financial summaries, retrieves recent news, scrapes text for grounding, and uses LLM reasoning to issue a structured investment verdict ("Invest" or "Pass") backed by clear citations and a detailed analysis transcript.

---

## 1. Overview
The **AI Investment Research Agent** is designed to streamline the preliminary phase of equity research. Given a company name or ticker, the agent:
1. Resolves the name to a stock ticker and exchange.
2. Extracts core financial indicators (valuation ratios, profitability, growth, debt ratios, free cash flow).
3. Gathers recent market news and crawls article texts.
4. Audits the collected data against the user's customized **Risk Tolerance** (Conservative, Balanced, Speculative).
5. Compiles a comprehensive analyst report showing a verdict, confidence level, positive drivers, key risks, web citations, and the raw AI reasoning logs.

---

## 2. Technical Stack & Architecture

### Tech Stack
- **AI Orchestration**: LangChain.js (`@langchain/core`, `@langchain/google-genai`).
- **Data Gathering**: Public search and quote summary scrapers (no paid keys required).
- **Web Scraping**: `cheerio` (extracting article body paragraphs for grounding).
- **Styling & Aesthetics**: Vanilla CSS with custom glassmorphism, responsive grid units, and custom dark mode layout rules.

### System Architecture
```
  [User Interface (Next.js App)]
        │                ▲
  (Search Query)   (Analysis Payload)
        ▼                │
  [Next.js API Router (/api/analyze)] 
        │
        ├──► 1. Ticker Resolver & News Search (Yahoo Search API)
        │
        ├──► 2. Financial Scraper (Yahoo HTML preloaded JSON parser)
        │
        ├──► 3. Web Crawler (Cheerio Scraping news article body text)
        │
        └──► 4. LangChain Agent Orchestrator (ChatGoogleGenerativeAI)
```

---

## 3. How to Run It

### Prerequisites
- Node.js (version 18 or higher; tested on v22.17.1)
- npm or yarn

### Installation
1. Extract the project files and navigate to the project directory:
   ```bash
   cd d:\INSIDEIIM
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```

### Configuration (.env)
A `.env` file has been pre-initialized in the project root. Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running the App
1. Start the Next.js development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
3. (Optional) Run the command-line pipeline verification script:
   ```bash
   node scratch/run_test.mjs
   ```

---

## 4. Key Decisions & Trade-Offs

### 1. Server-side API Key Configuration & Gemini Integration
- **Decision**: Configure the application to run strictly via Google's Gemini models (using `@langchain/google-genai` and model `gemini-2.0-flash`), loading the key securely from the server-side `.env` file.
- **Why**: Keeps the website interface clean, removes API key configuration details from the client-side UI, and simplifies developer setup by using standard, secure environment variables.

### 2. Custom No-Key Scraper vs. Paid APIs (Finnhub/NewsAPI)
- **Decision**: Developed a parsing utility in `lib/yahooFinance.js` that pulls financial quote summaries from Yahoo HTML script elements and search nodes.
- **Why**: Finnhub and AlphaVantage have strict rate limits on free keys (or require credit cards). NewsAPI blocks localhost requests on its free tier. Scraping Yahoo Finance ensures the app works immediately out of the box with zero external configuration or paid keys.

### 3. Client-side LocalStorage Caching vs. MongoDB
- **Decision**: Persisted historical reports in the browser's `localStorage` rather than a server-side MongoDB instance.
- **Why**: Eliminates the requirement for the evaluator to host, configure, and connect a database server, matching the "zero-setup" run goal while maintaining a persistent search history.

---

## 5. Example Runs

### Example Run 1: Tesla, Inc. (TSLA)
- **Price**: 419.77 USD
- **Risk Tolerance**: Medium (Balanced)
- **Verdict**: **PASS** (Confidence: 65%)
- **Summary**: While Tesla exhibits robust revenue growth (15.8%) and a low debt-to-equity ratio (18.74%), its current valuation (P/E ratio of 381.61, Forward P/E of 164.81) is extremely premium. Under medium risk tolerance guidelines, the current stock price implies massive speculative growth that is not fully supported by near-term earnings indicators.
- **Key Metrics Highlight**:
  * Trailing P/E: 381.61 (Premium Value)
  * Debt/Equity: 18.74% (Low Debt)
  * Revenue Growth: 15.8% (Strong Growth)
  * Free Cash Flow: 5.25B (Healthy)
- **Pros**: Outstanding solvency, strong liquidity ratios, robust balance sheet, dominant EV market position.
- **Cons**: Excessive valuation ratios, deceleration in vehicle delivery growth, intense global competitor pricing pressure.

### Example Run 2: Apple Inc. (AAPL)
- **Price**: 312.66 USD
- **Risk Tolerance**: Low (Conservative)
- **Verdict**: **INVEST** (Confidence: 82%)
- **Summary**: Apple Inc. continues to represent a premier defensive investment. Despite slow top-line growth (moderate revenue growth), the company generates massive free cash flows (over $100B) and exhibits a phenomenal return on equity (ROE) of over 140%.
- **Key Metrics Highlight**:
  * Trailing P/E: 37.81 (Premium Value)
  * Debt/Equity: 79.55% (Moderate Debt)
  * Free Cash Flow: 101.09B (Highly Cash Generative)
  * profit Margin: 27.15% (Highly Profitable)
- **Pros**: Exceptional cash generation capability, high operating margins, massive dividend security, stable product ecosystem.
- **Cons**: High trailing P/E relative to historic averages, regulatory antitrust threats from DOJ and EU.

---

## 6. Future Improvements (With More Time)
1. **Multi-Agent Consensus (LangGraph)**: Set up a multi-agent system where a Financial Analyst Agent, Macroeconomic Analyst Agent, and Technical Sentiment Agent debate the merits of an stock, resolving in a final voting consensus.
2. **Interactive Charting**: Integrate `recharts` or lightweight charts to plot the historical revenue and earnings charts returned by the scraper.
3. **PDF Generation**: Add a button to compile the report into a PDF formatted research note for offline download.
4. **Vector Embeddings (Pinecone)**: Implement full vector indexing on news content to retrieve top semantic chunks rather than scraping full articles.

---

## 7. AI Chat Session Logs / Transcripts (Bonus)
The transcript logs representing the conversation with the AI during development are maintained locally:
- **Task list tracker**: [task.md](file:///C:/Users/Lenovo/.gemini/antigravity-ide/brain/8520e518-3e60-4a3c-8f52-8303ec91c86d/task.md)
- **Technical plan**: [implementation_plan.md](file:///C:/Users/Lenovo/.gemini/antigravity-ide/brain/8520e518-3e60-4a3c-8f52-8303ec91c86d/implementation_plan.md)
- **System Trajectory File**: The IDE conversation logs and tool operations are persisted in the workspace configuration logs under `<appDataDir>\brain\8520e518-3e60-4a3c-8f52-8303ec91c86d\.system_generated\logs\transcript.jsonl`.
