# AURORA — Premium AI Investment Research Suite

> [!IMPORTANT]
> **Production Live Link & Test Credentials**
> * **Web Address:** [aurora.amanranjan.site](https://aurora.amanranjan.site)
> * **Login Email:** `testing@aurora.com`
> * **Login Password:** `password123`

---

## 1. Overview — What It Does
AURORA is a cinematic, professional-grade AI investment research workspace that automates equity analysis on public stocks. Leveraging a multi-agent orchestration pipeline, AURORA resolves search queries to exact exchange listings, scrapes financial statement records, parses live market news for grounding, and audits company metrics against strict margin and solvency guidelines using generative AI. 

### Core Features:
* **Zero-Key Web Scraping**: Extracts company stats and news directly from public financial portals, bypassing the need for paid API keys.
* **Cinematic Dark Dashboard**: High-fidelity, Bloomberg-style interface with step-by-step pipeline animations, responsive SVG charts, and confidence gauges.
* **Audit Pipeline Stepper**: Visualizes the research lifecycle in real-time, detailing search resolution, statement crawling, news extraction, and Gemini reasoning.
* **Credentials Syncing**: Dual API Key configurations enabling server-side `.env` defaults or client-side dynamic key loading stored in browser `localStorage`.
* **Prisma Database Syncing**: Stores search history, query counts, and analysis states securely in a PostgreSQL database (Prisma Client).

---

## 2. Onboarding & Layout Showcase

### Landing Page Showcase
The welcoming product landing page showcases a premium, moving-grid design with orbital canvas particles that respond to the user's cursor.
* **Launch Control**: Allows instant login/signup and redirects users to the secure research console.
* **Instant Search**: Features an autocomplete search field that suggests matches character-by-character.

![AURORA Landing Page](/public/screenshots/landing_page.png)

### Research Console Workspace
The console workspace is structured as a three-column Bloomberg-style layout designed for clarity and analytical focus:
1. **Left Sidebar (History & Audit Log)**: Tracks past query histories. Clicking any item instantly re-hydrates the dashboard with the saved analysis. Includes a database sync trigger and a "Clear History" button.
2. **Center Pane (Research Board)**: The main command center housing the query input, live stepper, verdict panel, charts, and metrics.
3. **Right Sidebar (Real-time Audit Log)**: Displays a running terminal log of the active research pipeline steps.

![AURORA Research Console](/public/screenshots/research_dashboard.png)

---

## 3. How It Works — Approach & Architecture

### Step-by-Step Audit Pipeline
When you search a company or select a ticker from the autocomplete dropdown, AURORA starts a 5-step auditing sequence:
1. **Resolving Ticker**: Searches the market for matching listings (e.g. mapping "Samsung" to `005930.KS`).
2. **Fetching Financials**: Downloads the company profile, core stats (P/E ratio, PEG, profit margins), and historical statements.
3. **Scraping Market News**: Collects the top 3 news articles and parses their body paragraphs using Cheerio for RAG grounding.
4. **Gemini Analysis**: Feeds the grounded data into a custom prompt template evaluated by `gemini-2.5-flash` under Zod validation schemas.
5. **Compiling Report**: Formats the final investment decision, confidence score, catalysts, and reasoning.

### Technical Stack & Core Architecture
- **Framework**: Next.js (modular pages and API routes).
- **Database**: PostgreSQL (Prisma ORM for schema sync and history storage).
- **AI Orchestration**: LangChain.js Core (`@langchain/core`, `@langchain/google-genai`).
- **Reasoning Model**: Google Gemini (`gemini-2.5-flash`).
- **Data Scraping**: `cheerio` (web crawler for news text paragraphs).
- **Styling**: Vanilla CSS (incorporates viewport sliding grids, glassmorphism, animated stepper components, and responsive cards).

---

## 4. Key Decisions & Trade-offs

* **Zero-Key Public Web Scraper instead of Paid APIs**: 
  * *Why*: Decided to crawl/scrape Yahoo Finance directly using a custom parser instead of using paid APIs (like AlphaVantage, Bloomberg, or FMP).
  * *Trade-off*: Eliminates setup friction and costs for reviewers, but makes the tool susceptible to external website HTML layout changes and rate-limiting.
* **Cheerio-based News Grounding over Heavy RAG Databases**: 
  * *Why*: Scrapes the top news article bodies using Cheerio to ground the model on the fly.
  * *Trade-off*: Provides extremely fast execution and keeps token costs low, but lacks permanent vector embeddings or historical lookup capabilities.
* **Gemini-2.5-Flash with Zod Structured Output**: 
  * *Why*: Selected `gemini-2.5-flash` over `gemini-2.5-pro` or `gpt-4o` for its massive context window, fast reasoning speeds, and low latency.
  * *Trade-off*: Provides immediate responses, but may occasionally output slightly less detailed summaries than its heavier `pro` counterparts. We offset this by structuring outputs strictly using Zod schemas to guarantee parsability.
* **Vanilla CSS for Styling**: 
  * *Why*: Avoided TailwindCSS to prevent utility-class clutter and ensure absolute control over neon glow styles, glassmorphism containers, animated terminal blocks, and custom CSS particles.
  * *Trade-off*: Takes longer to customize, but yields a distinct, premium, and unified cinematic workspace.
* **Failsafe Database Proxy**: 
  * *Why*: Built a database fallback proxy in the API routes. If `DATABASE_URL` is omitted, the app compiles cleanly and runs in "Guest Mode" rather than crashing.

---

## 5. Example Runs & Agent Outputs

### Example 1: Apple Inc. (AAPL)
* **Verdict**: **INVEST**
* **Confidence**: **85%**
* **Financial Highlights**: P/E: 29.8 · Operating Margin: 30.7% · Debt-to-Equity: 1.45
* **AI Analysis Summary**:
  > Apple displays robust free cash flow generation and unmatched ecosystem lock-in. Solvency metrics remain strong despite high leverage, which is backed by reliable hardware margins and rapid service growth. 
  > * **Positive Catalysts**: Strong Services revenue momentum; high customer loyalty; expansion of Apple Intelligence.
  > * **Risk Catalysts**: Valuation multiple is near the historical high end; minor hardware stagnation in Asian markets.

### Example 2: Tesla Inc. (TSLA)
* **Verdict**: **PASS**
* **Confidence**: **65%**
* **Financial Highlights**: P/E: 72.4 · Operating Margin: 8.2% · Debt-to-Equity: 0.12
* **AI Analysis Summary**:
  > Tesla maintains a fortress balance sheet with near-zero debt, but the trailing P/E multiple represents a high growth premium. Short-term earnings growth is lagging due to competitive EV pricing.
  > * **Positive Catalysts**: Industry-leading battery manufacturing efficiency; significant cash reserves.
  > * **Risk Catalysts**: Margin compression from global automotive pricing wars; high regulatory credit revenue reliance.

### Example 3: NVIDIA Corporation (NVDA)
* **Verdict**: **INVEST**
* **Confidence**: **90%**
* **Financial Highlights**: P/E: 65.2 · PEG Ratio: 1.15 · Profit Margin: 55.0%
* **AI Analysis Summary**:
  > NVIDIA represents a high-growth investment backed by a virtual monopoly in AI hardware. Solvency ratios are pristine, and the PEG ratio of 1.15 demonstrates that the high multiple is justified by actual triple-digit revenue growth.
  > * **Positive Catalysts**: Massive Blackwell GPU backlog; robust software moat via CUDA ecosystems.
  > * **Risk Catalysts**: Customer concentration risks; global supply chain dependencies.

---

## 6. What We Would Improve with More Time

* **Multi-Agent Coordination (LangGraph)**: Transition the single-agent pipeline into a multi-agent hierarchy with dedicated agents: a Web Search Researcher, a Balance Sheet Auditor, and a Portfolio Evaluator.
* **Comprehensive PDF Report Exporting**: Add server-side or client-side PDF compilation to let users download or email formatted visual audit summaries.
* **Historical Chart Comparisons**: Expand the single-ticker chart layout to plot multiple ticker financials on the same SVG grid to visually benchmark peer companies.
* **Portfolio Integration**: Implement simulated user portfolios where audited stocks can be added or subtracted to check asset allocation impacts.

---

## 7. How to Run Locally

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation
1. Clone the repository and navigate into the directory:
   ```bash
   git clone https://github.com/amanrj03/AURORA.git
   cd AURORA
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```

### Configuration (.env)
Create a `.env` file in the root of the project directory and configure the following parameters:
```env
# Database Connection (PostgreSQL connection string, e.g. Neon DB)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Session Security Token (Used to sign JWT authorization tokens)
JWT_SECRET="your-jwt-auth-session-key-any-random-string"

# Google Gemini API Key (Required for stock research prompts)
GEMINI_API_KEY="AIzaSy..."

# Google SSO Client ID (Required to activate Google One-Tap/Sign-In buttons)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"

# SMTP Mail Server Credentials (Required for sending OTP verification codes)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM="Aurora Workspace <your-email@gmail.com>"
```

### Database Synchronization
Synchronize your local Prisma Client definitions and push the schema tables to your live PostgreSQL database:
```bash
npx prisma db push
```

### Running the App
1. Launch the Next.js local development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
