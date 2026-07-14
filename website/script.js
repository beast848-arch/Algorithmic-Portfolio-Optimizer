/* ================================================================
   ALGORITHMIC PORTFOLIO OPTIMIZER — Script
   ================================================================ */

/* ----------------------------------------------------------------
   S&P 500 STOCK DATABASE
   ---------------------------------------------------------------- */
const SP500_STOCKS = [
  // Technology
  { ticker:'AAPL',  name:'Apple Inc.',                  sector:'Technology' },
  { ticker:'MSFT',  name:'Microsoft Corp.',              sector:'Technology' },
  { ticker:'NVDA',  name:'NVIDIA Corp.',                 sector:'Technology' },
  { ticker:'AVGO',  name:'Broadcom Inc.',                sector:'Technology' },
  { ticker:'AMD',   name:'Advanced Micro Devices',       sector:'Technology' },
  { ticker:'ADBE',  name:'Adobe Inc.',                   sector:'Technology' },
  { ticker:'QCOM',  name:'Qualcomm Inc.',                sector:'Technology' },
  { ticker:'TXN',   name:'Texas Instruments',            sector:'Technology' },
  { ticker:'INTC',  name:'Intel Corp.',                  sector:'Technology' },
  { ticker:'AMAT',  name:'Applied Materials',            sector:'Technology' },
  { ticker:'MU',    name:'Micron Technology',            sector:'Technology' },
  { ticker:'LRCX',  name:'Lam Research',                 sector:'Technology' },
  { ticker:'KLAC',  name:'KLA Corp.',                    sector:'Technology' },
  { ticker:'SNPS',  name:'Synopsys Inc.',                sector:'Technology' },
  { ticker:'CDNS',  name:'Cadence Design Systems',       sector:'Technology' },
  { ticker:'CRM',   name:'Salesforce Inc.',              sector:'Technology' },
  { ticker:'NOW',   name:'ServiceNow Inc.',              sector:'Technology' },
  { ticker:'INTU',  name:'Intuit Inc.',                  sector:'Technology' },
  { ticker:'ORCL',  name:'Oracle Corp.',                 sector:'Technology' },
  { ticker:'IBM',   name:'IBM Corp.',                    sector:'Technology' },
  { ticker:'ACN',   name:'Accenture PLC',                sector:'Technology' },
  { ticker:'PANW',  name:'Palo Alto Networks',           sector:'Technology' },
  { ticker:'CRWD',  name:'CrowdStrike Holdings',         sector:'Technology' },
  { ticker:'FTNT',  name:'Fortinet Inc.',                sector:'Technology' },
  { ticker:'ANET',  name:'Arista Networks',              sector:'Technology' },
  { ticker:'MRVL',  name:'Marvell Technology',           sector:'Technology' },
  { ticker:'NXPI',  name:'NXP Semiconductors',           sector:'Technology' },
  // Communication Services
  { ticker:'GOOGL', name:'Alphabet Inc. (Class A)',      sector:'Communication' },
  { ticker:'GOOG',  name:'Alphabet Inc. (Class C)',      sector:'Communication' },
  { ticker:'META',  name:'Meta Platforms',               sector:'Communication' },
  { ticker:'NFLX',  name:'Netflix Inc.',                 sector:'Communication' },
  { ticker:'DIS',   name:'Walt Disney Co.',              sector:'Communication' },
  { ticker:'CMCSA', name:'Comcast Corp.',                sector:'Communication' },
  { ticker:'T',     name:'AT&T Inc.',                    sector:'Communication' },
  { ticker:'VZ',    name:'Verizon Communications',       sector:'Communication' },
  { ticker:'TMUS',  name:'T-Mobile US Inc.',             sector:'Communication' },
  { ticker:'CHTR',  name:'Charter Communications',       sector:'Communication' },
  { ticker:'EA',    name:'Electronic Arts Inc.',         sector:'Communication' },
  { ticker:'TTWO',  name:'Take-Two Interactive',         sector:'Communication' },
  // Healthcare
  { ticker:'LLY',   name:'Eli Lilly & Co.',              sector:'Healthcare' },
  { ticker:'UNH',   name:'UnitedHealth Group',           sector:'Healthcare' },
  { ticker:'JNJ',   name:'Johnson & Johnson',            sector:'Healthcare' },
  { ticker:'ABBV',  name:'AbbVie Inc.',                  sector:'Healthcare' },
  { ticker:'MRK',   name:'Merck & Co.',                  sector:'Healthcare' },
  { ticker:'PFE',   name:'Pfizer Inc.',                  sector:'Healthcare' },
  { ticker:'TMO',   name:'Thermo Fisher Scientific',     sector:'Healthcare' },
  { ticker:'ABT',   name:'Abbott Laboratories',          sector:'Healthcare' },
  { ticker:'DHR',   name:'Danaher Corp.',                sector:'Healthcare' },
  { ticker:'ISRG',  name:'Intuitive Surgical',           sector:'Healthcare' },
  { ticker:'SYK',   name:'Stryker Corp.',                sector:'Healthcare' },
  { ticker:'MDT',   name:'Medtronic PLC',                sector:'Healthcare' },
  { ticker:'VRTX',  name:'Vertex Pharmaceuticals',       sector:'Healthcare' },
  { ticker:'REGN',  name:'Regeneron Pharmaceuticals',    sector:'Healthcare' },
  { ticker:'GILD',  name:'Gilead Sciences',              sector:'Healthcare' },
  { ticker:'AMGN',  name:'Amgen Inc.',                   sector:'Healthcare' },
  { ticker:'HUM',   name:'Humana Inc.',                  sector:'Healthcare' },
  { ticker:'CVS',   name:'CVS Health Corp.',             sector:'Healthcare' },
  { ticker:'CI',    name:'Cigna Group',                  sector:'Healthcare' },
  { ticker:'ELV',   name:'Elevance Health',              sector:'Healthcare' },
  { ticker:'BSX',   name:'Boston Scientific',            sector:'Healthcare' },
  { ticker:'ZTS',   name:'Zoetis Inc.',                  sector:'Healthcare' },
  // Financials
  { ticker:'JPM',   name:'JPMorgan Chase & Co.',         sector:'Financials' },
  { ticker:'V',     name:'Visa Inc.',                    sector:'Financials' },
  { ticker:'MA',    name:'Mastercard Inc.',              sector:'Financials' },
  { ticker:'GS',    name:'Goldman Sachs Group',          sector:'Financials' },
  { ticker:'BAC',   name:'Bank of America Corp.',        sector:'Financials' },
  { ticker:'WFC',   name:'Wells Fargo & Co.',            sector:'Financials' },
  { ticker:'MS',    name:'Morgan Stanley',               sector:'Financials' },
  { ticker:'BLK',   name:'BlackRock Inc.',               sector:'Financials' },
  { ticker:'SCHW',  name:'Charles Schwab Corp.',         sector:'Financials' },
  { ticker:'AXP',   name:'American Express Co.',         sector:'Financials' },
  { ticker:'SPGI',  name:'S&P Global Inc.',              sector:'Financials' },
  { ticker:'C',     name:'Citigroup Inc.',               sector:'Financials' },
  { ticker:'USB',   name:'U.S. Bancorp',                 sector:'Financials' },
  { ticker:'PGR',   name:'Progressive Corp.',            sector:'Financials' },
  { ticker:'CB',    name:'Chubb Ltd.',                   sector:'Financials' },
  { ticker:'MMC',   name:'Marsh McLennan',               sector:'Financials' },
  { ticker:'ICE',   name:'Intercontinental Exchange',    sector:'Financials' },
  { ticker:'CME',   name:'CME Group Inc.',               sector:'Financials' },
  { ticker:'AON',   name:'Aon PLC',                      sector:'Financials' },
  { ticker:'MET',   name:'MetLife Inc.',                 sector:'Financials' },
  // Consumer Discretionary
  { ticker:'AMZN',  name:'Amazon.com Inc.',              sector:'Consumer Disc.' },
  { ticker:'TSLA',  name:'Tesla Inc.',                   sector:'Consumer Disc.' },
  { ticker:'HD',    name:'Home Depot Inc.',              sector:'Consumer Disc.' },
  { ticker:'MCD',   name:"McDonald's Corp.",             sector:'Consumer Disc.' },
  { ticker:'NKE',   name:'Nike Inc.',                    sector:'Consumer Disc.' },
  { ticker:'SBUX',  name:'Starbucks Corp.',              sector:'Consumer Disc.' },
  { ticker:'LOW',   name:"Lowe's Companies",             sector:'Consumer Disc.' },
  { ticker:'BKNG',  name:'Booking Holdings Inc.',        sector:'Consumer Disc.' },
  { ticker:'TJX',   name:'TJX Companies Inc.',           sector:'Consumer Disc.' },
  { ticker:'GM',    name:'General Motors Co.',           sector:'Consumer Disc.' },
  { ticker:'F',     name:'Ford Motor Co.',               sector:'Consumer Disc.' },
  { ticker:'ABNB',  name:'Airbnb Inc.',                  sector:'Consumer Disc.' },
  { ticker:'RCL',   name:'Royal Caribbean Group',        sector:'Consumer Disc.' },
  { ticker:'CCL',   name:'Carnival Corp.',               sector:'Consumer Disc.' },
  { ticker:'MAR',   name:'Marriott International',       sector:'Consumer Disc.' },
  { ticker:'HLT',   name:'Hilton Worldwide Holdings',    sector:'Consumer Disc.' },
  { ticker:'ORLY',  name:"O'Reilly Automotive",          sector:'Consumer Disc.' },
  { ticker:'AZO',   name:'AutoZone Inc.',                sector:'Consumer Disc.' },
  { ticker:'EBAY',  name:'eBay Inc.',                    sector:'Consumer Disc.' },
  // Consumer Staples
  { ticker:'PG',    name:'Procter & Gamble Co.',         sector:'Consumer Staples' },
  { ticker:'KO',    name:'Coca-Cola Co.',                sector:'Consumer Staples' },
  { ticker:'COST',  name:'Costco Wholesale Corp.',       sector:'Consumer Staples' },
  { ticker:'PEP',   name:'PepsiCo Inc.',                 sector:'Consumer Staples' },
  { ticker:'WMT',   name:'Walmart Inc.',                 sector:'Consumer Staples' },
  { ticker:'PM',    name:'Philip Morris International',  sector:'Consumer Staples' },
  { ticker:'MO',    name:'Altria Group Inc.',            sector:'Consumer Staples' },
  { ticker:'MDLZ',  name:'Mondelez International',       sector:'Consumer Staples' },
  { ticker:'CL',    name:'Colgate-Palmolive Co.',        sector:'Consumer Staples' },
  { ticker:'KMB',   name:'Kimberly-Clark Corp.',         sector:'Consumer Staples' },
  { ticker:'KR',    name:'Kroger Co.',                   sector:'Consumer Staples' },
  { ticker:'GIS',   name:'General Mills Inc.',           sector:'Consumer Staples' },
  { ticker:'HSY',   name:'Hershey Co.',                  sector:'Consumer Staples' },
  // Energy
  { ticker:'XOM',   name:'Exxon Mobil Corp.',            sector:'Energy' },
  { ticker:'CVX',   name:'Chevron Corp.',                sector:'Energy' },
  { ticker:'COP',   name:'ConocoPhillips',               sector:'Energy' },
  { ticker:'EOG',   name:'EOG Resources Inc.',           sector:'Energy' },
  { ticker:'SLB',   name:'SLB (Schlumberger)',           sector:'Energy' },
  { ticker:'MPC',   name:'Marathon Petroleum Corp.',     sector:'Energy' },
  { ticker:'PSX',   name:'Phillips 66',                  sector:'Energy' },
  { ticker:'OXY',   name:'Occidental Petroleum',         sector:'Energy' },
  { ticker:'KMI',   name:'Kinder Morgan Inc.',           sector:'Energy' },
  { ticker:'HAL',   name:'Halliburton Co.',              sector:'Energy' },
  { ticker:'BKR',   name:'Baker Hughes Co.',             sector:'Energy' },
  { ticker:'DVN',   name:'Devon Energy Corp.',           sector:'Energy' },
  // Industrials
  { ticker:'CAT',   name:'Caterpillar Inc.',             sector:'Industrials' },
  { ticker:'GE',    name:'GE Aerospace',                 sector:'Industrials' },
  { ticker:'UNP',   name:'Union Pacific Corp.',          sector:'Industrials' },
  { ticker:'RTX',   name:'RTX Corp.',                    sector:'Industrials' },
  { ticker:'HON',   name:'Honeywell International',      sector:'Industrials' },
  { ticker:'LMT',   name:'Lockheed Martin Corp.',        sector:'Industrials' },
  { ticker:'BA',    name:'Boeing Co.',                   sector:'Industrials' },
  { ticker:'DE',    name:'Deere & Company',              sector:'Industrials' },
  { ticker:'UPS',   name:'United Parcel Service',        sector:'Industrials' },
  { ticker:'FDX',   name:'FedEx Corp.',                  sector:'Industrials' },
  { ticker:'CSX',   name:'CSX Corp.',                    sector:'Industrials' },
  { ticker:'NSC',   name:'Norfolk Southern Corp.',       sector:'Industrials' },
  { ticker:'ETN',   name:'Eaton Corp.',                  sector:'Industrials' },
  { ticker:'PH',    name:'Parker-Hannifin Corp.',        sector:'Industrials' },
  { ticker:'GD',    name:'General Dynamics',             sector:'Industrials' },
  { ticker:'NOC',   name:'Northrop Grumman',             sector:'Industrials' },
  { ticker:'MMM',   name:'3M Company',                   sector:'Industrials' },
  { ticker:'AME',   name:'AMETEK Inc.',                  sector:'Industrials' },
  { ticker:'CARR',  name:'Carrier Global Corp.',         sector:'Industrials' },
  { ticker:'OTIS',  name:'Otis Worldwide Corp.',         sector:'Industrials' },
  // Utilities
  { ticker:'NEE',   name:'NextEra Energy Inc.',          sector:'Utilities' },
  { ticker:'SO',    name:'Southern Co.',                 sector:'Utilities' },
  { ticker:'DUK',   name:'Duke Energy Corp.',            sector:'Utilities' },
  { ticker:'D',     name:'Dominion Energy Inc.',         sector:'Utilities' },
  { ticker:'AEP',   name:'American Electric Power',      sector:'Utilities' },
  { ticker:'EXC',   name:'Exelon Corp.',                 sector:'Utilities' },
  { ticker:'SRE',   name:'Sempra Energy',                sector:'Utilities' },
  { ticker:'PCG',   name:'PG&E Corp.',                   sector:'Utilities' },
  // Real Estate
  { ticker:'PLD',   name:'Prologis Inc.',                sector:'Real Estate' },
  { ticker:'AMT',   name:'American Tower Corp.',         sector:'Real Estate' },
  { ticker:'EQIX',  name:'Equinix Inc.',                 sector:'Real Estate' },
  { ticker:'SPG',   name:'Simon Property Group',         sector:'Real Estate' },
  { ticker:'WELL',  name:'Welltower Inc.',               sector:'Real Estate' },
  { ticker:'CCI',   name:'Crown Castle Inc.',            sector:'Real Estate' },
  { ticker:'PSA',   name:'Public Storage',               sector:'Real Estate' },
  { ticker:'O',     name:'Realty Income Corp.',          sector:'Real Estate' },
  // Materials
  { ticker:'LIN',   name:'Linde PLC',                    sector:'Materials' },
  { ticker:'APD',   name:'Air Products & Chemicals',     sector:'Materials' },
  { ticker:'SHW',   name:'Sherwin-Williams Co.',         sector:'Materials' },
  { ticker:'FCX',   name:'Freeport-McMoRan Inc.',        sector:'Materials' },
  { ticker:'NEM',   name:'Newmont Corp.',                sector:'Materials' },
  { ticker:'ECL',   name:'Ecolab Inc.',                  sector:'Materials' },
  { ticker:'DD',    name:'DuPont de Nemours',            sector:'Materials' },
  { ticker:'ALB',   name:'Albemarle Corp.',              sector:'Materials' },
  { ticker:'PPG',   name:'PPG Industries',               sector:'Materials' },
  // Macro / ETFs
  { ticker:'GLD',   name:'SPDR Gold Shares ETF',         sector:'Macro' },
  { ticker:'TLT',   name:'iShares 20+ Yr Treasury ETF',  sector:'Macro' },
  { ticker:'IEF',   name:'iShares 7-10 Yr Treasury ETF', sector:'Macro' },
  { ticker:'SHY',   name:'iShares 1-3 Yr Treasury ETF',  sector:'Macro' },
  { ticker:'TIP',   name:'iShares TIPS Bond ETF',        sector:'Macro' },
];

const SECTOR_BADGE = {
  'Technology':      'badge-Technology',
  'Communication':   'badge-Communication',
  'Healthcare':      'badge-Healthcare',
  'Financials':      'badge-Financials',
  'Consumer Disc.':  'badge-ConsumerDisc',
  'Consumer Staples':'badge-ConsumerStap',
  'Energy':          'badge-Energy',
  'Industrials':     'badge-Industrials',
  'Utilities':       'badge-Utilities',
  'Real Estate':     'badge-RealEstate',
  'Materials':       'badge-Materials',
  'Macro':           'badge-Macro',
};

// Company name lookup map
const COMPANY_MAP = {};
SP500_STOCKS.forEach(s => { COMPANY_MAP[s.ticker] = s.name; });

const MAX_STOCKS   = 35;
const RISK_FREE    = 0.04;        // 4% annual risk-free rate
const TRADING_DAYS = 252;

/* ----------------------------------------------------------------
   STATE
   ---------------------------------------------------------------- */
let selected     = new Set();
let activeSector = 'all';
let searchTerm   = '';
let isCalculating = false;

/* ----------------------------------------------------------------
   DOM REFS
   ---------------------------------------------------------------- */
const stockGrid          = document.getElementById('stock-grid');
const selectionCount     = document.getElementById('selection-count');
const selectionProgress  = document.getElementById('selection-progress');
const previewInner       = document.getElementById('selected-preview-inner');
const previewPlaceholder = document.getElementById('preview-placeholder');
const limitWarning       = document.getElementById('limit-warning');
const noResults          = document.getElementById('no-results');
const noResultsTerm      = document.getElementById('no-results-term');
const searchInput        = document.getElementById('stock-search');
const searchClearBtn     = document.getElementById('search-clear-btn');
const clearBtn           = document.getElementById('clear-btn');
const copyBtn            = document.getElementById('copy-btn');
const selectAllBtn       = document.getElementById('select-all-btn');
const filterTabs         = document.querySelectorAll('.filter-tab');
const calculateBtn       = document.getElementById('calculate-btn');

// Results
const resultsLoading    = document.getElementById('results-loading');
const resultsEmpty      = document.getElementById('results-empty');
const resultsPopulated  = document.getElementById('results-populated');
const metricReturn      = document.getElementById('metric-return');
const metricVol         = document.getElementById('metric-vol');
const metricSharpe      = document.getElementById('metric-sharpe');
const sharpeBadge       = document.getElementById('sharpe-badge');
const resultsMeta       = document.getElementById('results-meta');
const breakdownTbody    = document.getElementById('breakdown-tbody');
const loadingSub        = document.getElementById('loading-sub');
const loadingProgressBar= document.getElementById('loading-progress-bar');
const loadingStocks     = document.getElementById('loading-stocks');

/* ================================================================
   SECTION 1: STOCK GRID
   ================================================================ */

function buildGrid() {
  stockGrid.innerHTML = '';
  SP500_STOCKS.forEach(stock => {
    const card = document.createElement('div');
    card.className = 'stock-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('data-ticker', stock.ticker);
    card.setAttribute('data-sector', stock.sector);
    card.setAttribute('data-name', stock.name.toLowerCase());
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${stock.ticker} – ${stock.name}`);
    card.setAttribute('aria-pressed', 'false');

    const badgeClass = SECTOR_BADGE[stock.sector] || 'badge-Macro';
    card.innerHTML = `
      <div class="stock-check" aria-hidden="true"></div>
      <div class="stock-ticker">${stock.ticker}</div>
      <div class="stock-name">${stock.name}</div>
      <span class="stock-sector-badge ${badgeClass}">${stock.sector}</span>
    `;

    card.addEventListener('click', () => toggleStock(stock.ticker, card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleStock(stock.ticker, card); }
    });
    stockGrid.appendChild(card);
  });
}

function toggleStock(ticker, card) {
  if (selected.has(ticker)) {
    selected.delete(ticker);
    card.classList.remove('selected');
    card.querySelector('.stock-check').textContent = '';
    card.setAttribute('aria-pressed', 'false');
  } else {
    if (selected.size >= MAX_STOCKS) return;
    selected.add(ticker);
    card.classList.add('selected');
    card.querySelector('.stock-check').textContent = '✓';
    card.setAttribute('aria-pressed', 'true');
  }
  updateUI();
}

function updateUI() {
  const count = selected.size;
  const full  = count >= MAX_STOCKS;

  selectionCount.textContent = count;
  const pct = (count / MAX_STOCKS) * 100;
  selectionProgress.style.width = pct + '%';
  selectionProgress.setAttribute('aria-valuenow', count);
  selectionProgress.classList.toggle('full', full);

  limitWarning.style.display = full ? 'flex' : 'none';

  document.querySelectorAll('.stock-card').forEach(card => {
    const isSel = selected.has(card.getAttribute('data-ticker'));
    card.classList.toggle('disabled', full && !isSel);
  });

  // Enable Calculate button when ≥ 2 stocks selected
  calculateBtn.disabled = count < 2 || isCalculating;

  updatePreview();
}

function updatePreview() {
  previewInner.querySelectorAll('.preview-chip').forEach(el => el.remove());
  previewPlaceholder.style.display = selected.size === 0 ? '' : 'none';

  selected.forEach(ticker => {
    const chip = document.createElement('div');
    chip.className = 'preview-chip';
    chip.innerHTML = `${ticker}
      <button class="preview-chip-remove" aria-label="Remove ${ticker}">✕</button>`;
    chip.querySelector('.preview-chip-remove').addEventListener('click', e => {
      e.stopPropagation();
      const card = document.querySelector(`.stock-card[data-ticker="${ticker}"]`);
      if (card) toggleStock(ticker, card);
    });
    previewInner.appendChild(chip);
  });
}

/* ----------------------------------------------------------------
   Filters & Search
   ---------------------------------------------------------------- */
function applyFilters() {
  let visible = 0;
  const q = searchTerm.trim().toLowerCase();
  document.querySelectorAll('.stock-card').forEach(card => {
    const sector = card.getAttribute('data-sector');
    const ticker = card.getAttribute('data-ticker').toLowerCase();
    const name   = card.getAttribute('data-name');
    const ok = (activeSector === 'all' || sector === activeSector) &&
               (!q || ticker.includes(q) || name.includes(q));
    card.classList.toggle('hidden', !ok);
    if (ok) visible++;
  });
  noResults.style.display = visible === 0 ? 'block' : 'none';
  noResultsTerm.textContent = searchTerm;
}

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected','true');
    activeSector = tab.getAttribute('data-sector');
    applyFilters();
  });
});

searchInput.addEventListener('input', () => {
  searchTerm = searchInput.value;
  searchClearBtn.style.display = searchTerm ? 'block' : 'none';
  applyFilters();
});
searchClearBtn.addEventListener('click', () => {
  searchInput.value = ''; searchTerm = '';
  searchClearBtn.style.display = 'none';
  searchInput.focus(); applyFilters();
});

clearBtn.addEventListener('click', () => {
  selected.clear();
  document.querySelectorAll('.stock-card.selected').forEach(card => {
    card.classList.remove('selected');
    card.querySelector('.stock-check').textContent = '';
    card.setAttribute('aria-pressed','false');
  });
  updateUI();
  showResultsEmpty();
});

selectAllBtn.addEventListener('click', () => {
  document.querySelectorAll('.stock-card:not(.hidden)').forEach(card => {
    if (selected.size >= MAX_STOCKS) return;
    const ticker = card.getAttribute('data-ticker');
    if (!selected.has(ticker)) {
      selected.add(ticker);
      card.classList.add('selected');
      card.querySelector('.stock-check').textContent = '✓';
      card.setAttribute('aria-pressed','true');
    }
  });
  updateUI();
});

copyBtn.addEventListener('click', () => {
  if (selected.size === 0) { copyBtn.textContent = '⚠️ Nothing selected'; setTimeout(() => { copyBtn.innerHTML = '📋 Copy'; }, 1800); return; }
  const text = Array.from(selected).join(', ');
  navigator.clipboard.writeText(text)
    .then(() => { copyBtn.textContent = '✅ Copied!'; setTimeout(() => { copyBtn.innerHTML = '📋 Copy'; }, 2000); })
    .catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position='fixed'; ta.style.top='-9999px';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      copyBtn.textContent = '✅ Copied!'; setTimeout(() => { copyBtn.innerHTML = '📋 Copy'; }, 2000);
    });
});

/* ================================================================
   SECTION 2: FINANCIAL DATA & CALCULATIONS
   ================================================================ */

/* ----------------------------------------------------------------
   Fetch 1 year of adjusted closing prices from Yahoo Finance.
   Tries direct first, then falls back to two CORS proxies.
   ---------------------------------------------------------------- */
async function fetchPrices(ticker) {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1y&interval=1d&events=div%2Csplits`;
  const proxies  = [
    '',                                        // direct
    'https://corsproxy.io/?url=',
    'https://api.allorigins.win/raw?url=',
  ];

  for (const proxy of proxies) {
    try {
      const url  = proxy ? proxy + encodeURIComponent(yahooUrl) : yahooUrl;
      const res  = await fetch(url, { credentials: 'omit' });
      if (!res.ok) continue;
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result) continue;
      // prefer adjclose, fallback to close
      const closes = result.indicators?.adjclose?.[0]?.adjclose
                  || result.indicators?.quote?.[0]?.close;
      if (!closes || closes.length < 10) continue;
      // filter nulls
      return closes.filter(p => p != null && !isNaN(p) && p > 0);
    } catch (_) { /* try next proxy */ }
  }
  return null; // all attempts failed
}

/* ----------------------------------------------------------------
   Math helpers
   ---------------------------------------------------------------- */
function dailyReturns(prices) {
  const out = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] > 0) out.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return out;
}

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function sampleStd(arr, mu) {
  if (arr.length < 2) return 0;
  const m = (mu !== undefined) ? mu : mean(arr);
  return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / (arr.length - 1));
}

// Covariance between two ALIGNED return series
function covariance(a, b) {
  if (a.length !== b.length || a.length < 2) return 0;
  const ma = mean(a), mb = mean(b);
  return a.reduce((s, x, i) => s + (x - ma) * (b[i] - mb), 0) / (a.length - 1);
}

// Build annualized covariance matrix for a map of { ticker: returns[] }
function buildCovMatrix(returnsMap) {
  const tickers = Object.keys(returnsMap);
  const n       = tickers.length;
  // align to minimum shared length
  const minLen  = Math.min(...tickers.map(t => returnsMap[t].length));
  const aligned = {};
  tickers.forEach(t => { aligned[t] = returnsMap[t].slice(-minLen); });

  const cov = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (__, j) =>
      covariance(aligned[tickers[i]], aligned[tickers[j]]) * TRADING_DAYS
    )
  );
  return { cov, tickers, aligned };
}

// Portfolio metrics with equal weights
function portfolioMetrics(tickers, covMatrix, annualMeans) {
  const n = tickers.length;
  const w = Array(n).fill(1 / n);  // equal weight

  const pReturn = w.reduce((s, wi, i) => s + wi * annualMeans[i], 0);

  let pVar = 0;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      pVar += w[i] * w[j] * covMatrix[i][j];

  const pVol    = Math.sqrt(Math.max(pVar, 0));
  const pSharpe = pVol > 0 ? (pReturn - RISK_FREE) / pVol : 0;
  return { pReturn, pVol, pSharpe, weights: w };
}

/* ----------------------------------------------------------------
   Sharpe quality label
   ---------------------------------------------------------------- */
function sharpeLabel(s) {
  if (s >= 2.0) return { cls: 'excellent', text: '🏆 Excellent (≥ 2.0)' };
  if (s >= 1.0) return { cls: 'excellent', text: '⭐ Very Good (≥ 1.0)' };
  if (s >= 0.5) return { cls: 'good',      text: '👍 Good (≥ 0.5)' };
  if (s >= 0.0) return { cls: 'average',   text: '➡️ Below Average' };
  return              { cls: 'poor',       text: '⚠️ Negative Sharpe' };
}

/* ----------------------------------------------------------------
   Results UI helpers
   ---------------------------------------------------------------- */
function showResultsLoading()   { resultsLoading.style.display=''; resultsEmpty.style.display='none'; resultsPopulated.style.display='none'; }
function showResultsEmpty()     { resultsLoading.style.display='none'; resultsEmpty.style.display=''; resultsPopulated.style.display='none'; }
function showResultsPopulated() { resultsLoading.style.display='none'; resultsEmpty.style.display='none'; resultsPopulated.style.display=''; }

// Animate a number into a DOM element
function animateValue(el, value, suffix, decimals, duration = 1000) {
  const start = performance.now();
  const update = now => {
    const t = Math.min((now - start) / duration, 1);
    const e = 1 - Math.pow(1 - t, 3);
    el.textContent = (value * e).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ----------------------------------------------------------------
   Main Calculate handler
   ---------------------------------------------------------------- */
calculateBtn.addEventListener('click', async () => {
  if (selected.size < 2 || isCalculating) return;

  isCalculating = true;
  calculateBtn.disabled = true;
  document.getElementById('calc-btn-icon').textContent = '⏳';

  showResultsLoading();
  // Scroll to results
  setTimeout(() => {
    const el = document.getElementById('results');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);

  const tickers = Array.from(selected);
  const total   = tickers.length;

  loadingProgressBar.style.width = '0%';
  loadingSub.textContent = `Connecting to Yahoo Finance…`;
  loadingStocks.textContent = '';

  // --- Fetch all tickers ---
  const pricesMap  = {};
  const failedList = [];

  for (let i = 0; i < tickers.length; i++) {
    const ticker = tickers[i];
    loadingSub.textContent    = `Fetching ${ticker}… (${i + 1}/${total})`;
    loadingStocks.textContent = tickers.slice(0, i + 1).join(' · ');
    loadingProgressBar.style.width = `${((i + 1) / total) * 100}%`;

    const prices = await fetchPrices(ticker);
    if (prices && prices.length >= 20) {
      pricesMap[ticker] = prices;
    } else {
      failedList.push(ticker);
    }
  }

  const successTickers = Object.keys(pricesMap);

  if (successTickers.length < 2) {
    showResultsEmpty();
    resultsMeta.textContent = '⚠️ Could not fetch enough data. Check your internet connection and try again.';
    isCalculating = false;
    calculateBtn.disabled = false;
    document.getElementById('calc-btn-icon').textContent = '📊';
    return;
  }

  // --- Calculate per-stock metrics ---
  const stockMetrics = {};
  const returnsMap   = {};

  successTickers.forEach(ticker => {
    const ret     = dailyReturns(pricesMap[ticker]);
    const mu      = mean(ret);
    const sigma   = sampleStd(ret, mu);
    const annRet  = mu * TRADING_DAYS;
    const annVol  = sigma * Math.sqrt(TRADING_DAYS);
    const sharpe  = annVol > 0 ? (annRet - RISK_FREE) / annVol : 0;
    stockMetrics[ticker] = { annRet, annVol, sharpe, dataPoints: ret.length };
    returnsMap[ticker]   = ret;
  });

  // --- Portfolio-level metrics ---
  const { cov, tickers: covTickers } = buildCovMatrix(returnsMap);
  const annMeans = covTickers.map(t => stockMetrics[t].annRet);
  const { pReturn, pVol, pSharpe } = portfolioMetrics(covTickers, cov, annMeans);

  // --- Render metric cards ---
  showResultsPopulated();

  // Return
  const retPct = (pReturn * 100).toFixed(2);
  metricReturn.textContent = '';
  animateValue(metricReturn, pReturn * 100, '%', 2);
  if (pReturn < 0) metricReturn.classList.add('negative');
  else             metricReturn.classList.remove('negative');

  // Volatility
  metricVol.textContent = '';
  animateValue(metricVol, pVol * 100, '%', 2);

  // Sharpe
  metricSharpe.textContent = '';
  animateValue(metricSharpe, pSharpe, '', 3);
  if (pSharpe < 0) metricSharpe.classList.add('negative');
  else             metricSharpe.classList.remove('negative');

  // Sharpe badge
  const ql = sharpeLabel(pSharpe);
  sharpeBadge.className = `sharpe-badge ${ql.cls}`;
  sharpeBadge.textContent = ql.text;

  // Meta info
  const dateStr = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  resultsMeta.textContent = `${successTickers.length} stocks · Equal weights · 1-year data · Calculated ${dateStr}`;
  if (failedList.length > 0)
    resultsMeta.textContent += ` · ⚠️ ${failedList.length} stock(s) unavailable: ${failedList.join(', ')}`;

  // --- Breakdown table ---
  breakdownTbody.innerHTML = '';
  const weight = (1 / successTickers.length * 100).toFixed(2);

  // Sort by individual Sharpe descending
  const sortedTickers = [...successTickers].sort((a, b) => stockMetrics[b].sharpe - stockMetrics[a].sharpe);

  sortedTickers.forEach((ticker, idx) => {
    const m   = stockMetrics[ticker];
    const tr  = document.createElement('tr');
    tr.style.animationDelay = `${idx * 30}ms`;

    const retPct  = (m.annRet * 100).toFixed(2);
    const volPct  = (m.annVol * 100).toFixed(2);
    const sVal    = m.sharpe.toFixed(3);
    const retCls  = m.annRet >= 0 ? 'positive' : 'negative';
    const shClass = m.sharpe >= 1 ? 'excellent' : m.sharpe >= 0.5 ? 'good' : 'poor';

    tr.innerHTML = `
      <td class="td-ticker">${ticker}</td>
      <td class="td-company">${COMPANY_MAP[ticker] || '—'}</td>
      <td class="td-weight">${weight}%</td>
      <td class="td-return ${retCls}">${m.annRet >= 0 ? '+' : ''}${retPct}%</td>
      <td class="td-vol">${volPct}%</td>
      <td class="td-sharpe ${shClass}">${sVal}</td>
      <td><span class="status-pill ok">✓ OK</span></td>
    `;
    breakdownTbody.appendChild(tr);
  });

  // Add failed rows
  failedList.forEach((ticker, idx) => {
    const tr = document.createElement('tr');
    tr.style.animationDelay = `${(sortedTickers.length + idx) * 30}ms`;
    tr.innerHTML = `
      <td class="td-ticker">${ticker}</td>
      <td class="td-company">${COMPANY_MAP[ticker] || '—'}</td>
      <td class="td-weight">—</td>
      <td class="td-return na">—</td>
      <td class="td-vol">—</td>
      <td class="td-sharpe na">—</td>
      <td><span class="status-pill failed">✗ Unavailable</span></td>
    `;
    breakdownTbody.appendChild(tr);
  });

  isCalculating = false;
  calculateBtn.disabled = false;
  document.getElementById('calc-btn-icon').textContent = '📊';
});

/* ================================================================
   SECTION 3: GENERAL UI
   ================================================================ */

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Scroll fade-up
const scrollObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); scrollObs.unobserve(e.target); } }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.fade-up, .fade-in').forEach(el => scrollObs.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

// Parallax orbs
const orbs = document.querySelectorAll('.orb');
window.addEventListener('scroll', () => {
  orbs.forEach((orb, i) => { orb.style.transform = `translateY(${window.scrollY * (0.08 + i * 0.04)}px)`; });
}, { passive: true });

// Active nav highlight
const sectionObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting)
      document.querySelectorAll('.nav-links a[href^="#"]').forEach(l => {
        l.style.color = l.getAttribute('href') === `#${e.target.id}` ? '#4F8EF7' : '';
      });
  }),
  { threshold: 0.4 }
);
document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

/* ----------------------------------------------------------------
   INIT
   ---------------------------------------------------------------- */
buildGrid();
updateUI();
showResultsEmpty();
