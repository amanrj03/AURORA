# AURORA — Premium AI Investment Research Suite

AURORA is a cinematic, professional-grade AI investment research workspace that automates equity analysis on public stocks. Leveraging a multi-agent orchestration pipeline, AURORA resolves search queries to exact exchange listings, scrapes financial statement records, parses live market news for grounding, and audits company metrics against strict margin and solvency guidelines using generative AI. 

---

## 1. Landing Page Showcase
The welcoming product landing page showcases a premium, moving-grid design with orbital canvas particles that respond to the user's cursor.
* **Launch Control**: Allows instant login/signup and redirects users to the secure research console.
* **Instant Search**: Features an autocomplete search field that suggestions matches character-by-character.

![AURORA Landing Page](/public/screenshots/landing_page.png)

---

## 2. How the Research Console Works
The console workspace is structured as a three-column Bloomberg-style layout designed for clarity and analytical focus:
1. **Left Sidebar (History & Audit Log)**: Tracks past query histories. Clicking any item instantly re-hydrates the dashboard with the saved analysis. Includes a database sync trigger and a "Clear History" button.
2. **Center Pane (Research Board)**: The main command center housing the query input, live stepper, verdict panel, charts, and metrics.
3. **Right Sidebar (Real-time Audit Log)**: Displays a running terminal log of the active research pipeline steps.

![AURORA Research Console](/public/screenshots/research_dashboard.png)

---

## 3. Step-by-Step Audit Pipeline
When you search a company or select a ticker from the autocomplete dropdown, AURORA starts a 5-step auditing sequence:
1. **Resolving Ticker**: Searches the market for matching listings (e.g. mapping "Samsung" to `005930.KS`).
2. **Fetching Financials**: Downloads the company profile, core stats (P/E ratio, PEG, profit margins), and historical statements.
3. **Scraping Market News**: Collects the top 3 news articles and parses their body paragraphs using Cheerio for RAG grounding.
4. **Gemini Analysis**: Feeds the grounded data into a custom prompt template evaluated by `gemini-2.5-flash` under Zod validation schemas.
5. **Compiling Report**: Formats the final investment decision, confidence score, catalysts, and reasoning.

---

## 4. Dashboard Breakdown
Once the analysis completes, the dashboard updates with the following visual panels:

### 1. Compliance Decision & SVG Confidence Gauge
* Displays the final rating verdict: **INVEST** (emerald theme) or **PASS** (amber/red theme).
* Houses a custom circular **Confidence Gauge** rendering the AI's confidence percentage as a smooth, animated SVG arc.

### 2. Company Information Card
* Shows the listing name, ticker, and exchange (e.g. `005930.KS · Korea Exchange`).
* Includes a clickable link to visit the corporate website alongside the business summary description.

### 3. Financial Trajectory SVG Chart
* A custom, responsive SVG line and filled-area graph charting the last 4 years of annual financial history.
* Displays **Revenue** (orange line) and **Net Earnings** (red line) side-by-side. 
* Uses flexbox wrap layouts to ensure labels and legends stack cleanly on narrow mobile devices.

### 4. Wall Street Consensus Bar
* A segmented horizontal progress bar aggregating professional recommendations.
* Dynamically color-coded to visualize:
  * **Buy (Green)**: Combination of Buy + Strong Buy ratings.
  * **Hold (Gray)**: Neutral ratings.
  * **Sell (Red)**: Combination of Sell + Strong Sell ratings.
* Displays the exact count and percentage of analyst inputs covering the stock.

### 5. Audited Financial Indicators (Metrics Grid)
A grid of 9 crucial financial ratios extracted from live filings:
* **P/E Ratio** & **Forward P/E** (valuation multiples)
* **PEG Ratio** (growth-adjusted valuation)
* **Price to Book (P/B)** (asset backing)
* **Trailing & Forward EPS** (profitability per share)
* **Operating & Profit Margins** (core efficiency)
* **Debt to Equity** (balance sheet leverage)
* **Current Ratio** (liquidity buffer)
* **Revenue Growth** & **Total Revenue** (growth metrics)

### 6. Positive & Risk Catalysts
* Two side-by-side cards breaking down specific investment arguments.
* **Positive Catalysts (＋)** list factors driving the bullish case.
* **Risk Catalysts (－)** list risks, valuation premiums, or leverage flags.

### 7. Auditor Reasoning Transcript
A scrollable card that prints a clean, markdown-rendered transcript of the agent's complete logical workflow, summarizing why the verdict was made.

---

## 5. Technical Stack & Architecture

### Tech Stack
- **Framework**: Next.js (modular pages and API routes).
- **Database**: PostgreSQL (Prisma ORM for schema sync and history storage).
- **AI Orchestration**: LangChain.js Core (`@langchain/core`, `@langchain/google-genai`).
- **Reasoning Model**: Google Gemini (`gemini-2.5-flash`).
- **Data Scraping**: `cheerio` (web crawler for news text paragraphs).
- **Styling**: Vanilla CSS (incorporates viewport sliding grids, glassmorphism, animated stepper components, and responsive cards).

### Directory Structure
```
├── components/
│   ├── AnalystConsensus.js       # Wall Street consensus trends (SVG progress bar)
│   ├── ConfidenceGauge.js        # Circular SVG scoring rating (viewBox scalable)
│   ├── ConsolePage.js            # Three-column Bloomberg-style workspace layout
│   ├── DynamicParticleSphere.js  # Canvas orbital nodes grid background animation
│   ├── HistoricalEarningsChart.js# Interactive SVG annual area/line chart
│   ├── LandingPage.js            # Cinematic product introduction showcase
│   ├── ProfileModal.js           # User profiles, login/signup inputs, and OTP actions
│   └── PremiumLogo.js            # Dynamic logo container with fallbacks
├── lib/
│   ├── auth.js                   # JWT signing, verify tokens, password hashing
│   ├── db.js                     # Global Prisma client provider
│   ├── investAgent.js            # LangChain LCEL prompt chaining and schema binding
│   └── yahooFinance.js           # Quote data scraping resolver & mock fallbacks
├── pages/
│   ├── api/
│   │   ├── analyze.js            # Node backend endpoint mapping and error catcher
│   │   ├── search-suggestions.js # Autocomplete ticker suggester
│   │   └── auth/                 # Login, Signup, OTP, History sync API endpoints
│   └── index.js                  # Clean pages entry router (swaps Landing & Console)
├── prisma/
│   ├── schema.prisma             # PostgreSQL database schemas
│   └── migrations/               # Prisma migration files
├── public/
│   ├── screenshots/              # README guide images
│   └── logo.png                  # Place your custom branding image here
├── styles/
│   └── globals.css               # Base styles, grids, gradients, and custom animations
```

---

## 6. How to Run Locally

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
Create a `.env` file in the root folder containing:
```env
DATABASE_URL="your-postgresql-neon-database-url"
JWT_SECRET="your-jwt-auth-session-key"
GEMINI_API_KEY="your-google-gemini-api-key"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
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
3. Run the terminal pipeline validation script:
   ```bash
   node scratch/run_test.mjs
   ```
