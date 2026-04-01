# Project Status

## Overview

- Repository: `https://github.com/imjasondai/running_page`
- Local workspace: `C:\Users\DAIZJPC\OneDrive\Documents\07 Script\Running Page\running_page`
- Production site:
  - `https://run.dvorakd.com`
  - `https://run.dvorakd.com/running-life`
- Main data source: Strava
- Deployment: GitHub Actions + GitHub Pages

## Current Branding

- Site title: `DvorakD Running`
- Main domain: `run.dvorakd.com`
- Default theme: dark
- Navigation currently includes:
  - `Running Page`
  - `Workouts`
  - `Running Life`
  - `GitHub`
  - `About`

## Strava Sync Status

- Strava sync is already working.
- GitHub Actions secrets required:
  - `STRAVA_CLIENT_ID`
  - `STRAVA_CLIENT_SECRET`
  - `STRAVA_CLIENT_REFRESH_TOKEN`
- Scheduled sync time:
  - Every day at `10:00 Asia/Shanghai`
  - Workflow uses UTC cron and is documented in `.github/workflows/run_data_sync.yml`

## GitHub Pages Status

- GitHub Pages has been configured to publish from GitHub Actions.
- Custom domain has been configured:
  - `run.dvorakd.com`
- Cloudflare DNS should point:
  - `run.dvorakd.com -> imjasondai.github.io`
- Recommended Cloudflare proxy mode:
  - `DNS only` unless there is a specific reason to proxy

## Pages Added Beyond Upstream

### `/workouts`

- A large part of the workouts UI was migrated from `XmchxUp/running_page`.
- Current route exists and builds correctly.
- Current data file:
  - `src/static/workouts.json`
- Important note:
  - `workouts.json` is intentionally empty right now to avoid publishing someone else's training data.
- Result:
  - The page framework exists
  - The workouts page still needs a real personal workout data source to become useful

### `/running-life`

- A new `Running Life` page has been added.
- Route:
  - `/running-life`
- Current logic:
  - Uses existing `src/static/activities.json`
  - Aggregates running distance by month
  - Renders a life-month grid
  - Supports month detail modal with:
    - Distance
    - Runs
    - Time
    - Avg Pace
- Life-month model:
  - Birthday: `1989-01-13`
  - Total months: `1032` (`86 years * 12`)
  - The top counter is intended to match the reference style:
    - first number = current life month
    - second number = total planned life months

## Recent Direction

The project has been gradually moving toward the visual style of:

- `https://run.731558.xyz:6881/`
- especially its `running_life` presentation

This has started with:

- darker visual style
- expanded navigation
- standalone `Running Life` page
- workouts route migration

## Important Files

- Site metadata:
  - `src/static/site-metadata.ts`
- Theme logic:
  - `src/hooks/useTheme.ts`
- Main routes:
  - `src/main.tsx`
- Running page summary/activity UI:
  - `src/pages/index.tsx`
  - `src/pages/total.tsx`
- Workouts page:
  - `src/pages/workouts.tsx`
- Running Life page:
  - `src/pages/running-life.tsx`
- Main constants:
  - `src/utils/const.ts`
- Strava sync workflow:
  - `.github/workflows/run_data_sync.yml`
- Pages publish workflow:
  - `.github/workflows/gh-pages.yml`

## Verified Working Locally

These commands have been run successfully during recent work:

- `pnpm run lint`
- `pnpm build`

## Known Gaps / Next Steps

### High priority

- Continue refining `/running-life` to more closely match the reference page layout
- Decide what real data source should power `/workouts`

### Workouts page options

Option 1:
- connect a real strength-training data source
- examples: Hevy, Strong, Fitbod, or a custom JSON export

Option 2:
- redesign `/workouts` into a Strava-based running training page
- examples:
  - weekly mileage
  - pace trends
  - heart rate trends
  - long runs
  - interval / tempo statistics

### Running Life polish ideas

- overlay legend inside the grid like the reference page
- add export image button
- add layout toggle similar to the reference page
- refine typography and spacing
- highlight the current month more clearly

## Notes For Future Sessions

- The repository is the source of truth, not the chat history.
- If continuing work from another machine:
  - clone the GitHub repository
  - read this file first
  - then inspect:
    - `src/pages/running-life.tsx`
    - `src/pages/workouts.tsx`
    - `src/static/site-metadata.ts`

