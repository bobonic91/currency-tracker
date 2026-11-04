# Singapore 2050 — population explainer (Remotion)

A 20-second, 1920×1080 / 30 fps motion-graphics video made with [Remotion](https://www.remotion.dev/).

Rendered output: [`renders/singapore-population-2050.mp4`](renders/singapore-population-2050.mp4)

## Storyboard

| Time | Scene | What it shows |
| --- | --- | --- |
| 0–3 s | **Title** | "Singapore 2050": the year counts up from 2026 and a skyline rises under a crescent-and-stars emblem |
| 3–11 s | **01 · The trend** | Line chart of total population, 1970 → 2026 (2.07M → 6.21M), with a live counter. A dashed UN projection then runs to 2050 (≈6.1M), so the headline changes to "Then, a plateau" |
| 11–17 s | **02 · Why it stalls** | Fertility rate falls to **0.87** (replacement is 2.1). A 100-dot waffle shows the share of citizens aged 65+ going from 1 in 5 (2026) to 1 in 4 (2030) to ~1 in 3 (2050) |
| 17–20 s | **The 2050 picture** | "Singapore won't be much bigger — it will be much older." plus three summary stats |

## Data & sources

| Figure | Value | Source |
| --- | --- | --- |
| Total population, 1970–2026 | 2.07M → 6.21M (June 2026) | Singapore Department of Statistics; *Population Trends 2026* |
| 2040 / 2050 projection | ≈6.19M / ≈6.08M | UN *World Population Prospects 2024*, medium variant |
| Resident total fertility rate | 1.24 (2015), 0.97 (2024), **0.87 (2025)** | SingStat |
| Citizens aged 65+ | 21.4% (2026) | *Population in Brief 2026* |
| Citizens aged 65+ by 2030 | 23.9% | National Population and Talent Division |
| ~1 in 3 aged 65+ by 2050 | projection | IPS population scenarios; UN WPP-based projections |

The dashed projection joins the latest SingStat figure to the UN medium-variant
points. The UN uses a slightly different base population, so read that segment
as a trend, not a precise forecast. All the numbers live in [`src/data.ts`](src/data.ts).

## Run it

```bash
npm install
npm run studio   # interactive preview at http://localhost:3000
npm run render   # writes out/singapore-population-2050.mp4
```

If Remotion can't download its headless Chrome (offline or behind a proxy), point it at a local Chromium:

```bash
npx remotion render SingaporePopulation2050 out/singapore-population-2050.mp4 \
  --browser-executable=/path/to/chrome-headless-shell
```

## Project layout

```
src/
  Root.tsx                    composition registration (600 frames)
  SingaporePopulation2050.tsx scene sequence + transitions
  timing.ts                   scene lengths
  data.ts                     all figures, with sources
  theme.ts                    colours + bundled Inter font
  components/                 Background, Emblem, Eyebrow, Sources, ProgressBar
  scenes/                     TitleScene, GrowthChartScene, DriversScene, OutroScene
public/fonts/                 Inter (SIL Open Font License)
```
