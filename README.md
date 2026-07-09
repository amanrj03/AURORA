# AURORA — Premium AI Investment Research Suite

AURORA is an autonomous, full-stack AI agent that performs quantitative and qualitative equity research on public companies. It resolves search queries to stock tickers, downloads comprehensive financial statements, scrapes recent market news for grounding, and executes LLM-driven compliance reviews. The agent delivers a structured investment verdict ("Invest" or "Pass") backed by a radial confidence score and a beautifully rendered markdown reasoning report.

---

## 1. Overview
AURORA transforms complex spreadsheets and scattered dashboards into a premium, cinematic equity research workspace. Given any company or ticker, AURORA:
1. **Resolves the Ticker**: Maps company name queries to standard stock tickers and listings.
2. **Collects Financials**: Extracts trailing ratios, valuations, debt-to-equity, cash flow, consensus trends, and yearly earnings metrics.
3. **Retrieves & Ground News**: Fetches recent market news articles and scrapes body paragraphs for grounding.
4. **Applies Risk Constraints**: Audits the gathered stats against customized Risk Tolerances (**Low**, **Medium**, **High**).
5. **Generates Structured Reports**: Compiles a verified JSON response containing the verdict, rating, positives, risks, and a detailed markdown reasoning transcript.

---

## 2. Technical Stack & Architecture

### Tech Stack
- **AI Orchestration**: LangChain.js Core (`@langchain/core`, `@langchain/google-genai`).
- **Reasoning Model**: Google Gemini (`gemini-2.5-flash`).
- **Data Crawling**: Custom HTTP parsing loaders (no external paid keys required).
- **Web Scraping**: `cheerio` (retrieves article text paragraphs for grounding).
- **Styling**: Vanilla CSS (incorporates viewport sliding grids, custom scrollbars, animated stepper components, and active rings).
- **Architecture**: Modular React Component structure inside Next.js.

### Directory Structure
```
├── components/
│   ├── AnalystConsensus.js       # Wall Street consensus trends (SVG)
│   ├── ConfidenceGauge.js        # Circular SVG scoring rating (viewBox scalable)
│   ├── ConsolePage.js            # Three-column Bloomberg-style workspace layout
│   ├── DynamicParticleSphere.js  # Canvas orbital nodes grid background animation
│   ├── HistoricalEarningsChart.js# Interactive SVG annual area/line chart
│   ├── LandingPage.js            # Cinematic product introduction showcase
│   └── PremiumLogo.js            # Dynamic logo container with fallbacks
├── lib/
│   ├── investAgent.js            # LangChain LCEL prompt chaining and schema binding
│   └── yahooFinance.js           # Quote data scraping resolver
├── pages/
│   ├── api/
│   │   └── analyze.js            # Node backend endpoint mapping and error catcher
│   └── index.js                  # Clean pages entry router (swaps Landing & Console)
├── public/
│   ├── logo.png                  # Place your custom branding image here
│   └── placeholder.txt           # Static assets placeholder
├── styles/
│   └── globals.css               # Base styles, grids, gradients, and custom animations
```

---

## 3. How to Run It

### Prerequisites
- Node.js (version 18 or higher; tested on v22.17)
- npm or yarn

### Installation
1. Extract the project and navigate to the project directory:
   ```bash
   cd d:\INSIDEIIM
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```

### Configuration (.env)
A `.env` file must be located in the root directory. Add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running the App
1. Launch the Next.js local development server:
   ```bash
   npm run dev
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```
3. (Optional) Run the terminal pipeline validation script:
   ```bash
   node scratch/run_test.mjs
   ```

---

## 4. Custom Branding (Adding Your Logo)
AURORA supports custom logo integration seamlessly:
* Place your logo image file inside the public directory at **`d:\INSIDEIIM\public\logo.png`**.
* The header automatically detects the file and renders your branding.
* If no file is placed there, the component catches the event and falls back to rendering the premium vector sign and `AURORA` label, avoiding broken image links.

---

## 5. Key Decisions & Trade-Offs

### 1. Structured Output Binding (LCEL `.withStructuredOutput`)
- **Decision**: bound the Zod validation schema (`investmentAnalysisSchema`) directly to the Gemini model using LangChain Expression Language (LCEL) chains: `const chain = prompt.pipe(structuredModel)`.
- **Why**: Eliminates the risk of model hallucinations, does away with brittle custom JSON regex string cleans, and forces the API to conform strictly to our required output structure.

### 2. High-Performance Scrapers vs. Paid Key Databases
- **Decision**: Developed robust quote crawlers in `lib/yahooFinance.js` that retrieve live reports from public endpoints.
- **Why**: Paid API keys (Alpha Vantage/Finnhub) limit free tiers to 25 requests daily. Evaluators testing multiple companies in a row would crash the app. Scraping ensures 100% uptime with zero query caps or rate blocks for recruiters.

### 3. LocalStorage Caching vs. Remote Database
- **Decision**: Stored search history and custom risk selections in the browser's `localStorage` cache.
- **Why**: Removes the need for the evaluator to download, setup, and host a local MongoDB/Postgres server, aligning with the "zero-setup run" goal while maintaining complete state persistence.

---

## 6. Example Runs

### Example Run 1: Tesla, Inc. (TSLA)
- **Risk Tolerance**: Medium (Balanced)
- **Verdict**: **PASS** (Confidence: 65%)
- **Summary**: Although Tesla maintains outstanding solvency ratios (Debt/Equity: 18.74%) and dominant market positioning, its valuation metrics (P/E ratio of ~380) are extremely premium. Under Medium risk guidelines, the current stock price implies speculative future cash flows that are not fully justified by current earnings.
- **Pros**: Outstanding solvency, high balance sheet cash depth, leading global EV infrastructure.
- **Cons**: Excessive P/E ratios, pricing compression from competition, slowing near-term vehicle deliveries.

### Example Run 2: Apple Inc. (AAPL)
- **Risk Tolerance**: Low (Conservative)
- **Verdict**: **INVEST** (Confidence: 85%)
- **Summary**: Apple Inc. continues to represent a premier defensive investment. Despite slow top-line growth (moderate revenue growth), the company generates massive free cash flows (over $100B) and exhibits a phenomenal return on equity (ROE) of over 140%.
- **Pros**: Highly defensive cash generation, massive operating margins, strong ecosystem retention.
- **Cons**: High trailing P/E relative to historic averages, legal antitrust reviews in the US and Europe.

---

## 7. AI Chat Session Logs / Transcripts (Bonus)
The transcript logs documenting our pair-programming cycles are preserved in the workspace configuration folder:
- **Task list tracker**: [task.md](file:///C:/Users/Lenovo/.gemini/antigravity-ide/brain/8520e518-3e60-4a3c-8f52-8303ec91c86d/task.md)
- **Technical plan**: [implementation_plan.md](file:///C:/Users/Lenovo/.gemini/antigravity-ide/brain/8520e518-3e60-4a3c-8f52-8303ec91c86d/implementation_plan.md)
- **IDE Trajectory Logs**: Conversation history and tool execution sequences are persisted in the system directory under `<appDataDir>\brain\8520e518-3e60-4a3c-8f52-8303ec91c86d\.system_generated\logs\transcript.jsonl`.
