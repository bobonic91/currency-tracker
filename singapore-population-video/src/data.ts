// Total population of Singapore (residents + non-residents), millions, mid-year.
// Source: Singapore Department of Statistics (SingStat), incl. Population Trends 2026.
export const HISTORY: Array<[year: number, millions: number]> = [
  [1970, 2.07], [1975, 2.26], [1980, 2.41], [1985, 2.74], [1990, 3.05], [1995, 3.52],
  [2000, 4.03], [2001, 4.14], [2002, 4.18], [2003, 4.11], [2004, 4.17], [2005, 4.27],
  [2006, 4.40], [2007, 4.59], [2008, 4.84], [2009, 4.99], [2010, 5.08], [2011, 5.18],
  [2012, 5.31], [2013, 5.40], [2014, 5.47], [2015, 5.54], [2016, 5.61], [2017, 5.61],
  [2018, 5.64], [2019, 5.70], [2020, 5.69], [2021, 5.45], [2022, 5.64], [2023, 5.92],
  [2024, 6.04], [2025, 6.11], [2026, 6.21],
];

// UN World Population Prospects 2024, medium variant (2040 ≈ 6.19M, 2050 ≈ 6.08M),
// joined to the latest SingStat figure. The UN uses a slightly different base,
// so treat the dashed segment as a trend, not a forecast to two decimals.
export const PROJECTION: Array<[year: number, millions: number]> = [
  [2026, 6.21],
  [2040, 6.19],
  [2050, 6.08],
];

// Resident total fertility rate (births per woman). Source: SingStat.
export const TFR = {
  replacement: 2.1,
  y2015: 1.24,
  y2025: 0.87,
};

// Share of citizens aged 65+.
// 2026: Population in Brief 2026; 2030: NPTD projection; 2050: IPS scenario / UN-based projections.
export const SENIORS = [
  {year: '2026', pct: 21.4, ratio: '1 in 5', projected: false},
  {year: '2030', pct: 23.9, ratio: '1 in 4', projected: true},
  {year: '2050', pct: 33, ratio: '1 in 3', projected: true},
] as const;

export const valueAt = (
  series: Array<[number, number]>,
  year: number,
): number => {
  if (year <= series[0][0]) return series[0][1];
  for (let i = 1; i < series.length; i++) {
    const [x1, y1] = series[i];
    const [x0, y0] = series[i - 1];
    if (year <= x1) {
      return y0 + ((year - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return series[series.length - 1][1];
};
