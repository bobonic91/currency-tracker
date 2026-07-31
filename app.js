(() => {
  'use strict';

  const BASE = 'SGD';

  // Windows doesn't render regional-indicator flag emoji (falls back to plain
  // letters), so flags are drawn as inline SVGs for consistent rendering everywhere.
  // They're deliberately simplified (not heraldically exact) since they render at ~26px.
  const FLAG_JP = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#fff" stroke="#e2e8f0" stroke-width="0.5"/>
    <circle cx="15" cy="10" r="6" fill="#bc002d"/>
  </svg>`;

  const FLAG_CN = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#de2910"/>
    <g fill="#ffde00">
      <polygon points="5,2 6.1,5.5 9.8,5.5 6.8,7.7 7.9,11.2 5,9 2.1,11.2 3.2,7.7 0.2,5.5 3.9,5.5"/>
      <polygon points="10.2,1.5 10.6,2.6 11.8,2.6 10.9,3.3 11.2,4.4 10.2,3.7 9.2,4.4 9.5,3.3 8.6,2.6 9.8,2.6"/>
      <polygon points="12.6,4 13,5.1 14.2,5.1 13.3,5.8 13.6,6.9 12.6,6.2 11.6,6.9 11.9,5.8 11,5.1 12.2,5.1"/>
      <polygon points="12.6,7.6 13,8.7 14.2,8.7 13.3,9.4 13.6,10.5 12.6,9.8 11.6,10.5 11.9,9.4 11,8.7 12.2,8.7"/>
      <polygon points="10.2,10.4 10.6,11.5 11.8,11.5 10.9,12.2 11.2,13.3 10.2,12.6 9.2,13.3 9.5,12.2 8.6,11.5 9.8,11.5"/>
    </g>
  </svg>`;

  const FLAG_MY = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#fff"/>
    <g fill="#cc0001">
      <rect y="0" width="30" height="1.43"/>
      <rect y="2.86" width="30" height="1.43"/>
      <rect y="5.71" width="30" height="1.43"/>
      <rect y="8.57" width="30" height="1.43"/>
      <rect y="11.43" width="30" height="1.43"/>
      <rect y="14.29" width="30" height="1.43"/>
      <rect y="17.14" width="30" height="1.43"/>
    </g>
    <rect width="16" height="11.43" fill="#010066"/>
    <circle cx="7.5" cy="5.7" r="3.6" fill="#ffcc00"/>
    <circle cx="9" cy="5.7" r="3" fill="#010066"/>
    <polygon points="11,5.7 11.6,7.1 13.1,7.2 11.9,8.1 12.3,9.5 11,8.7 9.7,9.5 10.1,8.1 8.9,7.2 10.4,7.1" fill="#ffcc00"/>
  </svg>`;

  const FLAG_TH = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#fff"/>
    <rect y="0" width="30" height="3.33" fill="#a51931"/>
    <rect y="3.33" width="30" height="3.33" fill="#fff"/>
    <rect y="6.67" width="30" height="6.67" fill="#2d2a4a"/>
    <rect y="13.33" width="30" height="3.33" fill="#fff"/>
    <rect y="16.67" width="30" height="3.33" fill="#a51931"/>
  </svg>`;

  const FLAG_KR = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#fff" stroke="#e2e8f0" stroke-width="0.5"/>
    <path d="M15,5 A5,5 0 0,1 15,15 A2.5,2.5 0 0,1 15,10 A2.5,2.5 0 0,0 15,5 Z" fill="#c60c30"/>
    <path d="M15,15 A5,5 0 0,1 15,5 A2.5,2.5 0 0,1 15,10 A2.5,2.5 0 0,0 15,15 Z" fill="#003478"/>
    <g fill="#000">
      <rect x="3" y="2.5" width="4" height="0.7"/>
      <rect x="3" y="3.8" width="4" height="0.7"/>
      <rect x="3" y="5.1" width="4" height="0.7"/>
      <rect x="23" y="14.2" width="4" height="0.7"/>
      <rect x="23" y="15.5" width="4" height="0.7"/>
      <rect x="23" y="16.8" width="4" height="0.7"/>
      <rect x="23" y="2.5" width="1.7" height="0.7"/>
      <rect x="25.3" y="2.5" width="1.7" height="0.7"/>
      <rect x="23" y="3.8" width="4" height="0.7"/>
      <rect x="23" y="5.1" width="1.7" height="0.7"/>
      <rect x="25.3" y="5.1" width="1.7" height="0.7"/>
      <rect x="3" y="14.2" width="1.7" height="0.7"/>
      <rect x="5.3" y="14.2" width="1.7" height="0.7"/>
      <rect x="3" y="15.5" width="1.7" height="0.7"/>
      <rect x="5.3" y="15.5" width="1.7" height="0.7"/>
      <rect x="3" y="16.8" width="1.7" height="0.7"/>
      <rect x="5.3" y="16.8" width="1.7" height="0.7"/>
    </g>
  </svg>`;

  const FLAG_US = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#fff"/>
    <g fill="#b22234">
      <rect y="0" width="30" height="1.54"/>
      <rect y="3.08" width="30" height="1.54"/>
      <rect y="6.15" width="30" height="1.54"/>
      <rect y="9.23" width="30" height="1.54"/>
      <rect y="12.31" width="30" height="1.54"/>
      <rect y="15.38" width="30" height="1.54"/>
      <rect y="18.46" width="30" height="1.54"/>
    </g>
    <rect width="13" height="10.77" fill="#3c3b6e"/>
    <g fill="#fff">
      <circle cx="2.5" cy="2" r="0.5"/><circle cx="5.5" cy="2" r="0.5"/><circle cx="8.5" cy="2" r="0.5"/><circle cx="11.5" cy="2" r="0.5"/>
      <circle cx="4" cy="4" r="0.5"/><circle cx="7" cy="4" r="0.5"/><circle cx="10" cy="4" r="0.5"/>
      <circle cx="2.5" cy="6" r="0.5"/><circle cx="5.5" cy="6" r="0.5"/><circle cx="8.5" cy="6" r="0.5"/><circle cx="11.5" cy="6" r="0.5"/>
      <circle cx="4" cy="8" r="0.5"/><circle cx="7" cy="8" r="0.5"/><circle cx="10" cy="8" r="0.5"/>
    </g>
  </svg>`;

  const FLAG_EU = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#003399"/>
    <g fill="#ffcc00">
      <circle cx="15" cy="3.5" r="0.9"/><circle cx="18.25" cy="4.37" r="0.9"/><circle cx="20.63" cy="6.75" r="0.9"/>
      <circle cx="21.5" cy="10" r="0.9"/><circle cx="20.63" cy="13.25" r="0.9"/><circle cx="18.25" cy="15.63" r="0.9"/>
      <circle cx="15" cy="16.5" r="0.9"/><circle cx="11.75" cy="15.63" r="0.9"/><circle cx="9.37" cy="13.25" r="0.9"/>
      <circle cx="8.5" cy="10" r="0.9"/><circle cx="9.37" cy="6.75" r="0.9"/><circle cx="11.75" cy="4.37" r="0.9"/>
    </g>
  </svg>`;

  const FLAG_GB = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#00247d"/>
    <line x1="0" y1="0" x2="30" y2="20" stroke="#fff" stroke-width="4"/>
    <line x1="30" y1="0" x2="0" y2="20" stroke="#fff" stroke-width="4"/>
    <line x1="0" y1="0" x2="30" y2="20" stroke="#cf142b" stroke-width="1.6"/>
    <line x1="30" y1="0" x2="0" y2="20" stroke="#cf142b" stroke-width="1.6"/>
    <line x1="15" y1="0" x2="15" y2="20" stroke="#fff" stroke-width="6"/>
    <line x1="0" y1="10" x2="30" y2="10" stroke="#fff" stroke-width="6"/>
    <line x1="15" y1="0" x2="15" y2="20" stroke="#cf142b" stroke-width="2.4"/>
    <line x1="0" y1="10" x2="30" y2="10" stroke="#cf142b" stroke-width="2.4"/>
  </svg>`;

  const FLAG_AU = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#00247d"/>
    <line x1="0" y1="0" x2="13" y2="10" stroke="#fff" stroke-width="2"/>
    <line x1="13" y1="0" x2="0" y2="10" stroke="#fff" stroke-width="2"/>
    <line x1="6.5" y1="0" x2="6.5" y2="10" stroke="#fff" stroke-width="2.6"/>
    <line x1="0" y1="5" x2="13" y2="5" stroke="#fff" stroke-width="2.6"/>
    <line x1="6.5" y1="0" x2="6.5" y2="10" stroke="#cf142b" stroke-width="1"/>
    <line x1="0" y1="5" x2="13" y2="5" stroke="#cf142b" stroke-width="1"/>
    <g fill="#fff">
      <circle cx="21" cy="4" r="0.8"/><circle cx="24" cy="8" r="0.8"/><circle cx="20" cy="11" r="0.8"/>
      <circle cx="24.5" cy="13.5" r="0.8"/><circle cx="19" cy="15" r="0.6"/><circle cx="9" cy="16" r="0.9"/>
    </g>
  </svg>`;

  const FLAG_HK = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#de2910"/>
    <g fill="#fff">
      <ellipse cx="15" cy="6.5" rx="2" ry="3.5" transform="rotate(0,15,10)"/>
      <ellipse cx="15" cy="6.5" rx="2" ry="3.5" transform="rotate(72,15,10)"/>
      <ellipse cx="15" cy="6.5" rx="2" ry="3.5" transform="rotate(144,15,10)"/>
      <ellipse cx="15" cy="6.5" rx="2" ry="3.5" transform="rotate(216,15,10)"/>
      <ellipse cx="15" cy="6.5" rx="2" ry="3.5" transform="rotate(288,15,10)"/>
    </g>
  </svg>`;

  const FLAG_TW = `<svg class="flag-icon" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="30" height="20" fill="#fe0000"/>
    <rect width="15" height="10" fill="#000095"/>
    <circle cx="7.5" cy="5" r="2.6" fill="#fff"/>
    <g stroke="#fff" stroke-width="0.5">
      <line x1="7.5" y1="0.5" x2="7.5" y2="2.2"/><line x1="7.5" y1="7.8" x2="7.5" y2="9.5"/>
      <line x1="3" y1="5" x2="4.7" y2="5"/><line x1="10.3" y1="5" x2="12" y2="5"/>
      <line x1="4.5" y1="2" x2="5.7" y2="3.2"/><line x1="9.3" y1="6.8" x2="10.5" y2="8"/>
      <line x1="10.5" y1="2" x2="9.3" y2="3.2"/><line x1="5.7" y1="6.8" x2="4.5" y2="8"/>
    </g>
  </svg>`;

  const CURRENCY_META = {
    JPY: { flag: FLAG_JP, name: 'Japanese Yen', decimals: 0 },
    CNY: { flag: FLAG_CN, name: 'Chinese Yuan', decimals: 2 },
    MYR: { flag: FLAG_MY, name: 'Malaysian Ringgit', decimals: 2 },
    THB: { flag: FLAG_TH, name: 'Thai Baht', decimals: 2 },
    KRW: { flag: FLAG_KR, name: 'South Korean Won', decimals: 0 },
    USD: { flag: FLAG_US, name: 'US Dollar', decimals: 2 },
    EUR: { flag: FLAG_EU, name: 'Euro', decimals: 2 },
    GBP: { flag: FLAG_GB, name: 'British Pound', decimals: 2 },
    AUD: { flag: FLAG_AU, name: 'Australian Dollar', decimals: 2 },
    HKD: { flag: FLAG_HK, name: 'Hong Kong Dollar', decimals: 2 },
    TWD: { flag: FLAG_TW, name: 'Taiwan Dollar', decimals: 2 },
  };

  const ALL_CURRENCIES = Object.keys(CURRENCY_META);
  const DEFAULT_FAVORITES = ['JPY', 'CNY', 'MYR'];
  const DEFAULT_CHART_CURRENCY = 'JPY';
  const QUICK_SGD_AMOUNTS = [1, 10, 100];

  const RANGE_OPTIONS = {
    '1M': { label: '1M', longLabel: '1-month', months: 1 },
    '6M': { label: '6M', longLabel: '6-month', months: 6 },
    '1Y': { label: '1Y', longLabel: '1-year', months: 12 },
  };
  const DEFAULT_RANGE = '6M';

  const LATEST_TTL_MS = 5 * 60 * 1000;      // 5 minutes
  const HISTORY_TTL_MS = 20 * 60 * 1000;    // 20 minutes
  const API_TIMEOUT_MS = 10000;

  // api.frankfurter.app now redirects to api.frankfurter.dev/v1 — fetch() doesn't
  // follow that redirect cleanly, so call the new host directly.
  const API_ROOT = 'https://api.frankfurter.dev/v1';

  // ---------- Cache helpers ----------

  function cacheGet(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function cacheSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* storage full or unavailable — ignore */ }
  }

  function cacheGetFresh(key, ttlMs) {
    const entry = cacheGet(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > ttlMs) return null;
    return entry.data;
  }

  function cacheSetTimestamped(key, data) {
    cacheSet(key, { ts: Date.now(), data });
  }

  // ---------- Fetch helper ----------

  async function fetchJson(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  // ---------- Date helpers ----------

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function monthsAgoISO(months) {
    const d = new Date();
    d.setMonth(d.getMonth() - months);
    return d.toISOString().slice(0, 10);
  }

  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function formatShortDate(iso, includeYear) {
    const d = new Date(iso + 'T00:00:00');
    const opts = includeYear
      ? { day: 'numeric', month: 'short', year: '2-digit' }
      : { day: 'numeric', month: 'short' };
    return d.toLocaleDateString(undefined, opts);
  }

  // ---------- Persisted selection state ----------

  function loadFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem('ct_overview_favorites'));
      if (Array.isArray(stored)) {
        const valid = stored.filter((c) => ALL_CURRENCIES.includes(c));
        if (valid.length) return valid;
      }
    } catch (e) { /* ignore */ }
    return [...DEFAULT_FAVORITES];
  }

  function saveFavorites(favorites) {
    try {
      localStorage.setItem('ct_overview_favorites', JSON.stringify(favorites));
    } catch (e) { /* ignore */ }
  }

  function loadChartCurrency() {
    try {
      const stored = localStorage.getItem('ct_chart_currency');
      if (stored && ALL_CURRENCIES.includes(stored)) return stored;
    } catch (e) { /* ignore */ }
    return DEFAULT_CHART_CURRENCY;
  }

  function saveChartCurrency(cur) {
    try {
      localStorage.setItem('ct_chart_currency', cur);
    } catch (e) { /* ignore */ }
  }

  function loadRange() {
    try {
      const stored = localStorage.getItem('ct_trend_range');
      if (stored && RANGE_OPTIONS[stored]) return stored;
    } catch (e) { /* ignore */ }
    return DEFAULT_RANGE;
  }

  function saveRange(rangeKey) {
    try {
      localStorage.setItem('ct_trend_range', rangeKey);
    } catch (e) { /* ignore */ }
  }

  const MAX_COMPARE = 3;

  function loadCompare() {
    try {
      const stored = JSON.parse(localStorage.getItem('ct_compare_currencies'));
      if (Array.isArray(stored)) return stored.filter((c) => ALL_CURRENCIES.includes(c)).slice(0, MAX_COMPARE);
    } catch (e) { /* ignore */ }
    return [];
  }

  function saveCompare(compare) {
    try {
      localStorage.setItem('ct_compare_currencies', JSON.stringify(compare));
    } catch (e) { /* ignore */ }
  }

  // ---------- Data fetchers (with caching) ----------

  async function getLatestRates() {
    const key = 'ct_cache_latest';
    const cached = cacheGetFresh(key, LATEST_TTL_MS);
    if (cached) return cached;
    const url = `${API_ROOT}/latest?from=${BASE}&to=${ALL_CURRENCIES.join(',')}`;
    const data = await fetchJson(url);
    cacheSetTimestamped(key, data);
    return data;
  }

  async function getHistory(rangeKey) {
    const key = `ct_cache_history_${rangeKey}`;
    const cached = cacheGetFresh(key, HISTORY_TTL_MS);
    if (cached) return cached;
    const start = monthsAgoISO(RANGE_OPTIONS[rangeKey].months);
    const end = todayISO();
    const url = `${API_ROOT}/${start}..${end}?from=${BASE}&to=${ALL_CURRENCIES.join(',')}`;
    const data = await fetchJson(url);
    cacheSetTimestamped(key, data);
    return data;
  }

  // ---------- Global error banner ----------

  function showGlobalError(msg) {
    const el = document.getElementById('global-error');
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function clearGlobalError() {
    document.getElementById('global-error').classList.add('hidden');
  }

  // ---------- App state ----------

  let state = {
    latest: null,
    history: null,
    rangeKey: loadRange(),
    favorites: loadFavorites(),
    chartCurrency: loadChartCurrency(),
    compare: loadCompare(),
  };

  // ---------- Overview ----------

  function renderOverviewChips() {
    const container = document.getElementById('overview-chips');
    container.innerHTML = ALL_CURRENCIES.map((cur) => `
      <button type="button" class="chip ${state.favorites.includes(cur) ? 'active' : ''}" data-currency="${cur}">
        ${CURRENCY_META[cur].flag}<span>${cur}</span>
      </button>
    `).join('');

    container.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cur = btn.dataset.currency;
        if (state.favorites.includes(cur)) {
          state.favorites = state.favorites.filter((c) => c !== cur);
        } else {
          state.favorites = [...state.favorites, cur];
        }
        saveFavorites(state.favorites);
        renderOverviewChips();
        if (state.latest) renderOverview(state.latest, null);
        if (state.history) renderOverviewBadges(state.history);
      });
    });
  }

  function renderOverview(latest, fromCacheTs) {
    state.latest = latest;
    const grid = document.getElementById('overview-grid');

    if (state.favorites.length === 0) {
      grid.innerHTML = '<p class="meta">No currencies selected — tap a currency above to add it.</p>';
    } else {
      grid.innerHTML = state.favorites.map((cur) => {
        const rate = latest.rates ? latest.rates[cur] : undefined;
        const meta = CURRENCY_META[cur];
        return `
          <div class="rate-card" data-currency="${cur}">
            <span class="flag">${meta.flag}</span>
            <span class="pair">SGD → ${cur}</span>
            <span class="rate-value">${rate ? '1 SGD = ' + rate.toFixed(4) + ' ' + cur : 'N/A'}</span>
          </div>
        `;
      }).join('');
    }

    const updatedEl = document.getElementById('overview-updated');
    const asOf = latest.date ? formatDate(latest.date) : 'unknown date';
    if (fromCacheTs) {
      updatedEl.textContent = `Rate published ${asOf} · loaded from cache at ${new Date(fromCacheTs).toLocaleTimeString()}`;
    } else {
      updatedEl.textContent = `Rate published ${asOf} · just fetched`;
    }
  }

  function renderOverviewError() {
    const grid = document.getElementById('overview-grid');
    grid.innerHTML = state.favorites.map((cur) => {
      const meta = CURRENCY_META[cur];
      return `
        <div class="rate-card error">
          <span class="flag">${meta.flag}</span>
          <span class="pair">SGD → ${cur}</span>
          <span class="rate-value">Unavailable</span>
        </div>
      `;
    }).join('');
    document.getElementById('overview-updated').textContent = 'Could not reach the rate service.';
  }

  function computePercentileBadge(series) {
    if (series.length < 2) return null;
    const current = series[series.length - 1].value;
    const pct = Math.round(percentileRank(series, current));
    if (pct >= 90) return { text: `${ordinal(pct)} pct · 6M high`, cls: 'good' };
    if (pct <= 10) return { text: `${ordinal(pct)} pct · 6M low`, cls: 'bad' };
    return { text: `${ordinal(pct)} percentile (6M)`, cls: 'neutral' };
  }

  function computeMomentumBadge(series) {
    const momentum = computeMomentum(series);
    if (!momentum) return null;
    const cls = momentum.pctChange > 0.05 ? 'good' : momentum.pctChange < -0.05 ? 'bad' : 'neutral';
    const arrow = momentum.pctChange >= 0 ? '▲' : '▼';
    const sign = momentum.pctChange >= 0 ? '+' : '';
    return { text: `${arrow} ${sign}${momentum.pctChange.toFixed(1)}% (${momentum.days}d)`, cls };
  }

  function renderOverviewBadges(historyFor6M) {
    state.favorites.forEach((cur) => {
      const card = document.querySelector(`.rate-card[data-currency="${cur}"]`);
      if (!card) return;
      const existingRow = card.querySelector('.badge-row');
      if (existingRow) existingRow.remove();

      const series = buildSeries(historyFor6M, cur);
      const badges = [computePercentileBadge(series), computeMomentumBadge(series)].filter(Boolean);
      if (badges.length === 0) return;

      const row = document.createElement('div');
      row.className = 'badge-row';
      badges.forEach((badge) => {
        const el = document.createElement('span');
        el.className = `rate-badge ${badge.cls}`;
        el.textContent = badge.text;
        row.appendChild(el);
      });
      card.appendChild(row);
    });
  }

  async function loadOverviewBadges() {
    try {
      const history6m = state.rangeKey === '6M' ? state.history : await getHistory('6M');
      renderOverviewBadges(history6m);
    } catch (e) { /* badges are a nice-to-have; skip silently on failure */ }
  }

  // ---------- Quick reference ----------

  function renderQuickRef(latest, cur) {
    const container = document.getElementById('quickref-container');
    const rate = latest && latest.rates ? latest.rates[cur] : undefined;
    if (!rate) {
      container.innerHTML = '<p class="meta">Quick reference unavailable — no rate data.</p>';
      return;
    }
    const decimals = CURRENCY_META[cur].decimals;
    const rows = QUICK_SGD_AMOUNTS.map((amt) => {
      const foreign = amt * rate;
      return `<div class="quickref-row"><span>SGD ${amt}</span><span>≈ ${foreign.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ${cur}</span></div>`;
    }).join('');
    container.innerHTML = rows;
  }

  // ---------- Trend chart ----------

  function buildSeries(history, cur) {
    if (!history || !history.rates) return [];
    const dates = Object.keys(history.rates).sort();
    return dates
      .filter((d) => history.rates[d][cur] !== undefined)
      .map((d) => ({ date: d, value: history.rates[d][cur] }));
  }

  function axisDecimals(value) {
    return value >= 10 ? 2 : 3;
  }

  // Percentile rank: what fraction of days in the series had a value at or
  // below `current`. More robust than a min-max position since it isn't
  // skewed by a single outlier day at either extreme.
  function percentileRank(series, current) {
    const values = series.map((p) => p.value);
    const countAtOrBelow = values.filter((v) => v <= current).length;
    return (countAtOrBelow / values.length) * 100;
  }

  function ordinal(n) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  // Change over the last ~7 calendar days, using the closest available
  // (weekday) data point at or before that date.
  function computeMomentum(series) {
    if (series.length < 2) return null;
    const current = series[series.length - 1];
    const targetDate = new Date(current.date + 'T00:00:00');
    targetDate.setDate(targetDate.getDate() - 7);
    const targetISO = targetDate.toISOString().slice(0, 10);

    let past = null;
    for (let i = series.length - 1; i >= 0; i--) {
      if (series[i].date <= targetISO) { past = series[i]; break; }
    }
    if (!past) past = series[0];
    if (past.date === current.date) return null;

    const days = Math.round((new Date(current.date) - new Date(past.date)) / 86400000);
    const pctChange = ((current.value - past.value) / past.value) * 100;
    return { pctChange, days };
  }

  function renderChartSvg(series) {
    const width = 340;
    const height = 150;
    const padLeft = 46;
    const padRight = 10;
    const padTop = 14;
    const padBottom = 22;

    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const values = series.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const n = series.length;
    const stepX = n > 1 ? plotW / (n - 1) : 0;

    const xAt = (i) => padLeft + i * stepX;
    const yAt = (v) => padTop + plotH * (1 - (v - min) / range);

    const points = series.map((p, i) => `${xAt(i).toFixed(2)},${yAt(p.value).toFixed(2)}`);
    const lastX = xAt(n - 1);
    const lastY = yAt(values[n - 1]);
    const dec = axisDecimals(max);

    const spansYears = series[0].date.slice(0, 4) !== series[n - 1].date.slice(0, 4);
    const firstDate = formatShortDate(series[0].date, spansYears);
    const lastDate = formatShortDate(series[n - 1].date, spansYears);

    const baseline = height - padBottom;
    const areaPoints = `${padLeft},${baseline} ${points.join(' ')} ${lastX.toFixed(2)},${baseline}`;

    return `
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" class="chart-svg">
        <line x1="${padLeft}" y1="${yAt(max).toFixed(2)}" x2="${width - padRight}" y2="${yAt(max).toFixed(2)}" class="chart-grid" />
        <line x1="${padLeft}" y1="${yAt(min).toFixed(2)}" x2="${width - padRight}" y2="${yAt(min).toFixed(2)}" class="chart-grid" />
        <text x="${padLeft - 6}" y="${yAt(max).toFixed(2)}" text-anchor="end" dominant-baseline="middle" class="chart-label">${max.toFixed(dec)}</text>
        <text x="${padLeft - 6}" y="${yAt(min).toFixed(2)}" text-anchor="end" dominant-baseline="middle" class="chart-label">${min.toFixed(dec)}</text>
        <line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${height - padBottom}" class="chart-axis" />
        <line x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" class="chart-axis" />
        <text x="${padLeft}" y="${height - 6}" text-anchor="start" class="chart-label">${firstDate}</text>
        <text x="${width - padRight}" y="${height - 6}" text-anchor="end" class="chart-label">${lastDate}</text>
        <polygon points="${areaPoints}" class="chart-area" />
        <polyline points="${points.join(' ')}" fill="none" class="chart-line" stroke-width="2" vector-effect="non-scaling-stroke" />
        <circle cx="${lastX.toFixed(2)}" cy="${lastY.toFixed(2)}" r="3.5" class="chart-dot" />
      </svg>
    `;
  }

  function trendCallout(series, rangeLabel) {
    if (series.length < 2) {
      return { text: 'Not enough history yet to judge a trend.', cls: 'neutral' };
    }
    const values = series.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const current = values[values.length - 1];

    if (max === min) {
      return { text: `Rate has been flat over the last ${rangeLabel}.`, cls: 'neutral' };
    }

    const pct = Math.round(percentileRank(series, current));

    if (pct >= 90) {
      return { text: `🔼 ${ordinal(pct)} percentile — near a ${rangeLabel} high, a favorable time to convert SGD.`, cls: 'good' };
    }
    if (pct <= 10) {
      return { text: `🔽 ${ordinal(pct)} percentile — near a ${rangeLabel} low, an unfavorable time to convert SGD.`, cls: 'bad' };
    }
    return { text: `${ordinal(pct)} percentile of its ${rangeLabel} range — higher than ${pct}% of days in this period.`, cls: 'neutral' };
  }

  function renderTrend(history, rangeKey, cur) {
    const container = document.getElementById('trends-container');
    container.classList.remove('fade-in');
    void container.offsetWidth; // restart the animation on every render
    container.classList.add('fade-in');

    const rangeLabel = RANGE_OPTIONS[rangeKey].longLabel;
    const series = buildSeries(history, cur);

    if (series.length === 0) {
      container.innerHTML = '<p class="meta">No historical data available for this currency.</p>';
      return;
    }

    const values = series.map((p) => p.value);
    const current = values[values.length - 1];
    const callout = trendCallout(series, rangeLabel);

    container.innerHTML = `
      <div class="trend-chart-wrap">${renderChartSvg(series)}</div>
      <div class="trend-callout ${callout.cls}">${callout.text}</div>
      <div class="trend-range">1 SGD = ${current.toFixed(3)} ${cur} now</div>
    `;
  }

  function renderTrendsError() {
    document.getElementById('trends-container').innerHTML = '<p class="meta">Could not load trend history — check your connection and reload.</p>';
  }

  function renderTrendsLoading() {
    document.getElementById('trends-container').innerHTML = '<p class="meta">Loading chart…</p>';
  }

  function renderChartCurrencySelect() {
    const select = document.getElementById('chart-currency-select');
    select.innerHTML = ALL_CURRENCIES.map((cur) =>
      `<option value="${cur}" ${cur === state.chartCurrency ? 'selected' : ''}>${cur} — ${CURRENCY_META[cur].name}</option>`
    ).join('');
    select.addEventListener('change', () => {
      state.chartCurrency = select.value;
      saveChartCurrency(state.chartCurrency);
      if (state.history) renderTrend(state.history, state.rangeKey, state.chartCurrency);
      if (state.latest) renderQuickRef(state.latest, state.chartCurrency);
    });
  }

  // ---------- Compare (overlay) chart ----------

  function buildNormalizedSeries(history, cur) {
    const series = buildSeries(history, cur);
    if (series.length === 0) return [];
    const base = series[0].value;
    return series.map((p) => ({ date: p.date, value: (p.value / base) * 100 }));
  }

  function renderCompareChart(history, currencies) {
    const seriesList = currencies
      .map((cur) => ({ cur, series: buildNormalizedSeries(history, cur) }))
      .filter((s) => s.series.length > 0);

    if (seriesList.length === 0) {
      return '<p class="meta">No data available for the selected currencies.</p>';
    }

    const width = 340;
    const height = 170;
    const padLeft = 42;
    const padRight = 10;
    const padTop = 14;
    const padBottom = 22;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const allValues = seriesList.flatMap((s) => s.series.map((p) => p.value)).concat([100]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = (max - min) || 1;

    const n = seriesList[0].series.length;
    const stepX = n > 1 ? plotW / (n - 1) : 0;
    const xAt = (i) => padLeft + i * stepX;
    const yAt = (v) => padTop + plotH * (1 - (v - min) / range);
    const baselineY = yAt(100);

    const firstDate = formatShortDate(seriesList[0].series[0].date);
    const lastDate = formatShortDate(seriesList[0].series[n - 1].date);

    let linesSvg = '';
    let legendHtml = '';
    seriesList.forEach((s, idx) => {
      const pts = s.series.map((p, i) => `${xAt(i).toFixed(2)},${yAt(p.value).toFixed(2)}`).join(' ');
      linesSvg += `<polyline points="${pts}" fill="none" class="compare-line compare-line-${idx}" stroke-width="2" vector-effect="non-scaling-stroke" />`;
      const change = s.series[s.series.length - 1].value - 100;
      const meta = CURRENCY_META[s.cur];
      legendHtml += `
        <div class="compare-legend-item">
          <span class="compare-dot compare-dot-${idx}"></span>
          ${meta.flag}<span>${s.cur}</span>
          <span class="compare-legend-change ${change >= 0 ? 'good' : 'bad'}">${change >= 0 ? '+' : ''}${change.toFixed(1)}%</span>
        </div>
      `;
    });

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="chart-svg">
        <line x1="${padLeft}" y1="${baselineY.toFixed(2)}" x2="${width - padRight}" y2="${baselineY.toFixed(2)}" class="chart-grid" />
        <text x="${padLeft - 6}" y="${baselineY.toFixed(2)}" text-anchor="end" dominant-baseline="middle" class="chart-label">100</text>
        <line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${height - padBottom}" class="chart-axis" />
        <line x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" class="chart-axis" />
        <text x="${padLeft}" y="${height - 6}" text-anchor="start" class="chart-label">${firstDate}</text>
        <text x="${width - padRight}" y="${height - 6}" text-anchor="end" class="chart-label">${lastDate}</text>
        ${linesSvg}
      </svg>
    `;

    return `<div class="trend-chart-wrap">${svg}</div><div class="compare-legend">${legendHtml}</div>`;
  }

  function renderCompareSection() {
    const container = document.getElementById('compare-container');
    if (!state.history) {
      container.innerHTML = '<p class="meta">Loading…</p>';
      return;
    }
    if (state.compare.length < 2) {
      container.innerHTML = '<p class="meta">Select 2–3 currencies above to compare their relative movement.</p>';
      return;
    }
    container.innerHTML = renderCompareChart(state.history, state.compare);
  }

  function renderCompareChips() {
    const container = document.getElementById('compare-chips');
    container.innerHTML = ALL_CURRENCIES.map((cur) => `
      <button type="button" class="chip ${state.compare.includes(cur) ? 'active' : ''}" data-currency="${cur}">
        ${CURRENCY_META[cur].flag}<span>${cur}</span>
      </button>
    `).join('');

    container.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cur = btn.dataset.currency;
        if (state.compare.includes(cur)) {
          state.compare = state.compare.filter((c) => c !== cur);
        } else {
          if (state.compare.length >= MAX_COMPARE) return;
          state.compare = [...state.compare, cur];
        }
        saveCompare(state.compare);
        renderCompareChips();
        renderCompareSection();
      });
    });

    document.getElementById('compare-cap-note').classList.toggle('hidden', state.compare.length < MAX_COMPARE);
  }

  async function loadAndRenderHistory(rangeKey) {
    state.rangeKey = rangeKey;
    document.querySelectorAll('.range-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.range === rangeKey);
    });
    saveRange(rangeKey);

    renderTrendsLoading();
    try {
      const history = await getHistory(rangeKey);
      state.history = history;
      renderTrend(history, rangeKey, state.chartCurrency);
      renderCompareSection();
      loadOverviewBadges();
    } catch (e) {
      renderTrendsError();
    }
  }

  function initRangeSelector() {
    document.querySelectorAll('.range-btn').forEach((btn) => {
      btn.addEventListener('click', () => loadAndRenderHistory(btn.dataset.range));
    });
  }

  // ---------- Init ----------

  async function init() {
    initRangeSelector();
    renderOverviewChips();
    renderChartCurrencySelect();
    renderCompareChips();

    document.querySelectorAll('.range-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.range === state.rangeKey);
    });

    // Overview + quick reference
    try {
      const cachedEntry = cacheGet('ct_cache_latest');
      const isFresh = cachedEntry && (Date.now() - cachedEntry.ts <= LATEST_TTL_MS);
      const latest = await getLatestRates();
      renderOverview(latest, isFresh ? cachedEntry.ts : null);
      renderQuickRef(latest, state.chartCurrency);
      clearGlobalError();
    } catch (e) {
      const cachedEntry = cacheGet('ct_cache_latest');
      if (cachedEntry) {
        renderOverview(cachedEntry.data, cachedEntry.ts);
        renderQuickRef(cachedEntry.data, state.chartCurrency);
        showGlobalError('Live rates unavailable right now — showing the last cached rates.');
      } else {
        renderOverviewError();
        renderQuickRef(null, state.chartCurrency);
        showGlobalError('Unable to reach the exchange rate service. Check your connection and reload the page.');
      }
    }

    // Trend history
    await loadAndRenderHistory(state.rangeKey);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
