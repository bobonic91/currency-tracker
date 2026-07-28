(() => {
  'use strict';

  const BASE = 'SGD';
  const CURRENCIES = ['JPY', 'CNY', 'MYR'];
  // Windows doesn't render regional-indicator flag emoji (falls back to plain
  // letters), so flags are drawn as inline SVGs for consistent rendering everywhere.
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

  const CURRENCY_META = {
    JPY: { flag: FLAG_JP, name: 'Japanese Yen' },
    CNY: { flag: FLAG_CN, name: 'Chinese Yuan' },
    MYR: { flag: FLAG_MY, name: 'Malaysian Ringgit' },
  };
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

  // ---------- Data fetchers (with caching) ----------

  async function getLatestRates() {
    const key = 'ct_cache_latest';
    const cached = cacheGetFresh(key, LATEST_TTL_MS);
    if (cached) return cached;
    const url = `${API_ROOT}/latest?from=${BASE}&to=${CURRENCIES.join(',')}`;
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
    const url = `${API_ROOT}/${start}..${end}?from=${BASE}&to=${CURRENCIES.join(',')}`;
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

  // ---------- Overview ----------

  function renderOverview(latest, fromCacheTs) {
    const grid = document.getElementById('overview-grid');
    grid.innerHTML = '';
    CURRENCIES.forEach((cur) => {
      const rate = latest.rates ? latest.rates[cur] : undefined;
      const div = document.createElement('div');
      div.className = 'rate-card';
      div.dataset.currency = cur;
      const meta = CURRENCY_META[cur];
      div.innerHTML = `
        <span class="flag">${meta.flag}</span>
        <span class="pair">SGD → ${cur}</span>
        <span class="rate-value">${rate ? '1 SGD = ' + rate.toFixed(4) + ' ' + cur : 'N/A'}</span>
      `;
      grid.appendChild(div);
    });

    const updatedEl = document.getElementById('overview-updated');
    const asOf = latest.date ? formatDate(latest.date) : 'unknown date';
    if (fromCacheTs) {
      updatedEl.textContent = `Rate published ${asOf} · loaded from cache at ${new Date(fromCacheTs).toLocaleTimeString()}`;
    } else {
      updatedEl.textContent = `Rate published ${asOf} · just fetched`;
    }
  }

  function computeCardBadge(series) {
    if (series.length < 2) return null;
    const values = series.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const current = values[values.length - 1];
    const range = max - min;
    if (range === 0) return null;
    const pct = (current - min) / range;
    if (pct >= 0.85) return { text: '▲ Near 6M high', cls: 'good' };
    if (pct <= 0.15) return { text: '▼ Near 6M low', cls: 'bad' };
    return null;
  }

  async function loadOverviewBadges() {
    try {
      const history = await getHistory('6M');
      CURRENCIES.forEach((cur) => {
        const card = document.querySelector(`.rate-card[data-currency="${cur}"]`);
        if (!card) return;
        const badge = computeCardBadge(buildSeries(history, cur));
        if (!badge) return;
        const el = document.createElement('span');
        el.className = `rate-badge ${badge.cls}`;
        el.textContent = badge.text;
        card.appendChild(el);
      });
    } catch (e) { /* badges are a nice-to-have; skip silently on failure */ }
  }

  function renderOverviewError() {
    const grid = document.getElementById('overview-grid');
    grid.innerHTML = '';
    CURRENCIES.forEach((cur) => {
      const meta = CURRENCY_META[cur];
      const div = document.createElement('div');
      div.className = 'rate-card error';
      div.innerHTML = `
        <span class="flag">${meta.flag}</span>
        <span class="pair">SGD → ${cur}</span>
        <span class="rate-value">Unavailable</span>
      `;
      grid.appendChild(div);
    });
    document.getElementById('overview-updated').textContent = 'Could not reach the rate service.';
  }

  // ---------- Quick reference ----------

  function renderQuickRef(latest) {
    const container = document.getElementById('quickref-container');
    container.innerHTML = '';
    if (!latest || !latest.rates) {
      container.innerHTML = '<p class="meta">Quick reference unavailable — no rate data.</p>';
      return;
    }
    CURRENCIES.forEach((cur) => {
      const rate = latest.rates[cur];
      const meta = CURRENCY_META[cur];
      const block = document.createElement('div');
      block.className = 'quickref-currency';
      let rowsHtml = '';
      if (rate) {
        const decimals = cur === 'JPY' ? 0 : 2;
        QUICK_SGD_AMOUNTS.forEach((amt) => {
          const foreign = amt * rate;
          rowsHtml += `<div class="quickref-row"><span>SGD ${amt}</span><span>≈ ${foreign.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ${cur}</span></div>`;
        });
      } else {
        rowsHtml = '<div class="quickref-row"><span>Rate unavailable</span></div>';
      }
      block.innerHTML = `<h3>${meta.flag} ${cur}</h3>${rowsHtml}`;
      container.appendChild(block);
    });
  }

  // ---------- Trend charts ----------

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
    const range = max - min;

    if (range === 0) {
      return { text: `Rate has been flat over the last ${rangeLabel}.`, cls: 'neutral' };
    }

    const pct = (current - min) / range;

    if (pct >= 0.9) {
      return { text: `🔼 Near a ${rangeLabel} high — a favorable time to convert SGD.`, cls: 'good' };
    }
    if (pct <= 0.1) {
      return { text: `🔽 Near a ${rangeLabel} low — an unfavorable time to convert SGD.`, cls: 'bad' };
    }
    if (pct >= 0.55) {
      return { text: `Above the midpoint of its ${rangeLabel} range (~${Math.round(pct * 100)}% toward the high).`, cls: 'neutral' };
    }
    if (pct <= 0.45) {
      return { text: `Below the midpoint of its ${rangeLabel} range (~${Math.round(pct * 100)}% toward the high).`, cls: 'neutral' };
    }
    return { text: `Roughly in the middle of its ${rangeLabel} range.`, cls: 'neutral' };
  }

  function renderTrends(history, rangeKey) {
    const container = document.getElementById('trends-container');
    container.innerHTML = '';
    container.classList.remove('fade-in');
    // eslint-disable-next-line no-unused-expressions
    void container.offsetWidth; // restart the animation on every render
    container.classList.add('fade-in');
    const rangeLabel = RANGE_OPTIONS[rangeKey].longLabel;

    CURRENCIES.forEach((cur) => {
      const series = buildSeries(history, cur);
      const block = document.createElement('div');
      block.className = 'trend-block';

      if (series.length === 0) {
        block.innerHTML = `<div class="trend-title">SGD → ${cur}</div><p class="meta">No historical data available.</p>`;
        container.appendChild(block);
        return;
      }

      const values = series.map((p) => p.value);
      const current = values[values.length - 1];
      const callout = trendCallout(series, rangeLabel);

      block.innerHTML = `
        <div class="trend-title">${CURRENCY_META[cur].flag} SGD → ${cur}</div>
        <div class="trend-chart-wrap">${renderChartSvg(series)}</div>
        <div class="trend-callout ${callout.cls}">${callout.text}</div>
        <div class="trend-range">1 SGD = ${current.toFixed(3)} ${cur} now</div>
      `;
      container.appendChild(block);
    });
  }

  function renderTrendsError() {
    const container = document.getElementById('trends-container');
    container.innerHTML = '<p class="meta">Could not load trend history — check your connection and reload.</p>';
  }

  function renderTrendsLoading() {
    const container = document.getElementById('trends-container');
    container.innerHTML = '<p class="meta">Loading charts…</p>';
  }

  async function loadAndRenderTrends(rangeKey) {
    document.querySelectorAll('.range-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.range === rangeKey);
    });
    try {
      localStorage.setItem('ct_trend_range', rangeKey);
    } catch (e) { /* ignore */ }

    renderTrendsLoading();
    try {
      const history = await getHistory(rangeKey);
      renderTrends(history, rangeKey);
    } catch (e) {
      renderTrendsError();
    }
  }

  function initRangeSelector() {
    document.querySelectorAll('.range-btn').forEach((btn) => {
      btn.addEventListener('click', () => loadAndRenderTrends(btn.dataset.range));
    });
  }

  // ---------- Init ----------

  async function init() {
    initRangeSelector();

    // Overview + quick reference
    try {
      const cachedEntry = cacheGet('ct_cache_latest');
      const isFresh = cachedEntry && (Date.now() - cachedEntry.ts <= LATEST_TTL_MS);
      const latest = await getLatestRates();
      renderOverview(latest, isFresh ? cachedEntry.ts : null);
      renderQuickRef(latest);
      clearGlobalError();
    } catch (e) {
      const cachedEntry = cacheGet('ct_cache_latest');
      if (cachedEntry) {
        renderOverview(cachedEntry.data, cachedEntry.ts);
        renderQuickRef(cachedEntry.data);
        showGlobalError('Live rates unavailable right now — showing the last cached rates.');
      } else {
        renderOverviewError();
        renderQuickRef(null);
        showGlobalError('Unable to reach the exchange rate service. Check your connection and reload the page.');
      }
    }
    loadOverviewBadges();

    // Trend history
    let savedRange = DEFAULT_RANGE;
    try {
      const stored = localStorage.getItem('ct_trend_range');
      if (stored && RANGE_OPTIONS[stored]) savedRange = stored;
    } catch (e) { /* ignore */ }
    await loadAndRenderTrends(savedRange);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
