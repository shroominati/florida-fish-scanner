# Florida Fish Scanner

Florida Fish Scanner is an Expo/React Native starter app for Florida recreational anglers. It identifies a fish, estimates its length with user-assisted calibration, resolves fishing context from location and user input, and then runs a typed regulation decision engine that returns `LEGAL`, `ILLEGAL`, or `UNCERTAIN` with a plain-English trace.

This is deliberately built as a regulation decision app, not a simple image classifier.

## Chosen Stack

- Mobile: Expo + React Native + TypeScript
- Backend/data sync: Supabase Postgres
- Rules engine: pure TypeScript module shared across UI, tests, and future services
- Offline: bundled rules snapshot + AsyncStorage catch log
- ML: pluggable classifier boundary, currently mocked

Why this stack:

- Expo is the fastest way to ship camera, GPS, and offline field workflows without sacrificing a future path to native modules.
- A pure TypeScript rule engine keeps legal decision logic testable and isolated from UI code.
- Supabase provides a straightforward path for rule versioning, audit logs, admin publishing, and analytics.

## What Now Works

- Live still-image scan assistant with Expo camera preview, capture, framing guide, and GPS refresh
- Structured scan analysis with fish detected / no fish detected states
- Quality guidance for brightness, blur, angle, and framing
- Pluggable detector/classifier interfaces with a still-image pipeline abstraction
- Species review / confirm screen with top 3 candidates and forced confirmation when confidence is weak
- Manual assisted measurement on the captured photo:
  - nose point
  - tail point
  - reference start
  - reference end
- Printable-card calibration mode and known-length reference mode
- Legality result screen with:
  - species chosen
  - species confidence
  - measured size and uncertainty band
  - regulation zone
  - rule version
  - exact decision trace
  - source URL when present
- Saved catches with:
  - original image
  - candidate list
  - measurement confidence
  - calibration mode
  - GPS snapshot
  - retained/released state
  - decision trace snapshot
- Dev inspector screen in `__DEV__`
- Typed rule engine with zone resolution and uncertainty handling
- Seed Florida species and rules snapshot
- Supabase schema migration
- Admin validation / bundle scripts
- Scenario tests covering regulation logic, measurement math, parsing guards, and uncertainty behavior

## Folder Structure

```text
florida-fish-scanner/
  App.tsx
  src/
    components/
    data/
    features/
      classifier/
      measurement/
      regulations/
      storage/
    screens/
    services/
    theme/
    types/
    utils/
  supabase/migrations/
  scripts/
  tests/
  docs/
```

## Architecture Plan

See:

- [`docs/architecture.md`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/docs/architecture.md)
- [`docs/phased-build-plan.md`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/docs/phased-build-plan.md)

High-level architecture:

1. Capture fish photo and GPS on device.
2. Run classifier to get top 3 species candidates.
3. Confirm species manually when needed.
4. Calibrate length using reference dimensions and manual adjustment.
5. Resolve zone from GPS or manual override.
6. Match the active rule version for species, date, water type, and fishing mode.
7. Evaluate season, slot, bag, possession, catch-and-release state, and stale data.
8. Return a traced decision with explicit uncertainty.

## Seeded Data Snapshot

The bundled data is a curated MVP subset with source attribution and versioning:

- [`src/data/species.json`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/data/species.json)
- [`src/data/regulationRules.json`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/data/regulationRules.json)
- [`src/data/zones.json`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/data/zones.json)
- [`src/data/ruleVersions.json`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/data/ruleVersions.json)
- [`src/data/sources.json`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/data/sources.json)

Current seeded MVP species:

- Red Drum
- Black Drum
- Common Snook
- Spotted Seatrout
- Florida Pompano
- Tarpon
- Largemouth Bass
- Black Crappie

Important date note:

- The seeded spotted seatrout rules are future-dated to **April 1, 2026** because the FWC page says the newly approved changes begin on that date.

## Official Sources Used For the Seed Bundle

- FWC saltwater regulations index: [myfwc.com/fishing/saltwater/recreational](https://myfwc.com/fishing/saltwater/recreational/)
- FWC red drum: [myfwc.com/fishing/saltwater/recreational/red-drum](https://myfwc.com/fishing/saltwater/recreational/red-drum/)
- FWC black drum: [myfwc.com/fishing/saltwater/recreational/black-drum](https://myfwc.com/fishing/saltwater/recreational/black-drum/)
- FWC snook: [myfwc.com/fishing/saltwater/recreational/snook](https://myfwc.com/fishing/saltwater/recreational/snook/)
- FWC spotted seatrout: [myfwc.com/fishing/saltwater/recreational/spotted-seatrout](https://myfwc.com/fishing/saltwater/recreational/spotted-seatrout/)
- FWC permit / Florida pompano: [myfwc.com/fishing/saltwater/recreational/permit](https://myfwc.com/fishing/saltwater/recreational/permit/)
- FWC tarpon: [myfwc.com/fishing/saltwater/recreational/tarpon](https://myfwc.com/fishing/saltwater/recreational/tarpon/)
- FWC freshwater general regulations: [myfwc.com/fishing/freshwater/regulations/general](https://myfwc.com/fishing/freshwater/regulations/general/)
- FWC fish management areas: [myfwc.com/fishing/freshwater/regulations/fish-management-areas](https://myfwc.com/fishing/freshwater/regulations/fish-management-areas/)
- NOAA South Atlantic current regulations: [fisheries.noaa.gov/southeast/rules-regulations/current-fishing-regulations-south-atlantic](https://www.fisheries.noaa.gov/southeast/rules-regulations/current-fishing-regulations-south-atlantic)

## Setup

```bash
npm install
npm start
```

Useful commands:

```bash
npm run ios
npm run android
npm run web
npm run compat:server
npm run typecheck
npm run test
npx tsx scripts/validate-rules.ts
npx tsx scripts/build-rule-bundle.ts
```

## Embedded Compatibility Server

This workspace now includes a local embedded compatibility/testing server for approval-gated flows and external-client surface testing.

Routes:

- `GET /health`
- `GET /v1/capabilities`
- `POST /v1/grants/mint`
- `POST /v1/resume/web/grants/mint`
- `POST /v1/resume/telegram/grants/mint`
- `POST /v1/invoke`
- `GET /v1/audit`
- `GET /v1/history`

Start it with:

```bash
cd /Users/alfredmunoz/Documents/Playground/florida-fish-scanner
npm run compat:server
```

By default it listens on `http://127.0.0.1:4318`.

### Example tests

Open compatibility surface:

```bash
curl -s \
  -X POST http://127.0.0.1:4318/v1/invoke \
  -H 'content-type: application/json' \
  -H 'x-client-id: external-cli' \
  -H 'x-authority: external' \
  -d '{"capability":"compat.ping","input":{"ping":true}}'
```

Mint one-time grant:

```bash
curl -s \
  -X POST http://127.0.0.1:4318/v1/grants/mint \
  -H 'content-type: application/json' \
  -H 'x-client-id: external-cli' \
  -H 'x-authority: external' \
  -d '{"capability":"approval.echo","clientId":"external-cli","authority":"external","flow":"manual-test"}'
```

Invoke approval-bound capability with the returned token:

```bash
curl -s \
  -X POST http://127.0.0.1:4318/v1/invoke \
  -H 'content-type: application/json' \
  -H 'x-client-id: external-cli' \
  -H 'x-authority: external' \
  -d '{"capability":"approval.echo","input":{"hello":"world"},"grantToken":"PASTE_TOKEN_HERE"}'
```

Repo-local bypass test:

```bash
curl -s \
  -X POST http://127.0.0.1:4318/v1/invoke \
  -H 'content-type: application/json' \
  -H 'x-client-id: scanner-hot-path' \
  -H 'x-authority: repo_local' \
  -H 'x-repo-local-bypass: 1' \
  -d '{"capability":"approval.echo"}'
```

Audit and history inspection:

```bash
curl -s http://127.0.0.1:4318/v1/audit
curl -s http://127.0.0.1:4318/v1/history
```

## Manual Test Flow

### Scan flow

1. Run `npm start`.
2. Open the app in Expo Go or a simulator.
3. Tap `Open Camera`.
4. Capture a fish photo or use `Demo Fish` / `Demo No Fish`.
5. Confirm that the scan screen shows:
   - fish detected or no fish detected
   - brightness / blur / angle / framing quality states
   - guidance text
6. Tap `Continue to Species Review` or `Continue with Manual Review`.

### Measurement flow

1. In species review, pick a species.
2. On the measurement screen, choose `Printed 4 in card` or `Known-length reference`.
3. Tap the captured image to place:
   - nose
   - tail
   - reference start
   - reference end
4. Confirm the app shows:
   - measured total length
   - uncertainty band
   - measurement confidence badge
5. Enter fishing context and run the regulation engine.

### Result flow

1. Confirm the result screen shows:
   - chosen species
   - confidence %
   - measured size
   - regulation zone
   - rule version
   - trace lines
   - source URL when present
2. Save once as `Retained` and once as `Released`.
3. Open `Saved Catches` and verify the image, candidate list, GPS, calibration mode, and trace snapshot are present.

### Dev flow

1. Open `Settings`.
2. In development builds, tap `Open Dev Inspector`.
3. Verify loaded bundle counts, current zone resolution, and manual simulation output.

## Regulation Schema

The normalized rule schema supports:

- species aliases
- statewide and special-area zone overrides
- min/max size
- inclusive vs exclusive size thresholds
- slot rules
- bag and possession limits
- seasonal closures
- catch-and-release only species
- adjacent federal-water applicability
- versioned bundles with source attribution

Primary definitions:

- [`src/types/domain.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/types/domain.ts)
- [`supabase/migrations/202603081130_init.sql`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/supabase/migrations/202603081130_init.sql)

## Admin Data Sync / Update Path

The starter repo does not scrape official HTML directly into production rules yet. Instead it uses a safer staged workflow:

1. Curate source-backed JSON in `src/data/`.
2. Validate referential integrity with [`scripts/validate-rules.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/scripts/validate-rules.ts).
3. Build bundle metadata with [`scripts/build-rule-bundle.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/scripts/build-rule-bundle.ts).
4. Publish the new bundle into Supabase tables with audit-log entries.

This keeps rules data-driven and updateable without rewriting the mobile app.

## Testing

Automated coverage now includes:

- slot limit comparisons
- seasonal closures
- over-slot allowances
- freshwater special-area overrides
- missing GPS / missing rule cases
- stale bundle handling
- federal vs state water mismatches
- low-confidence species or measurement paths
- manual point measurement calculations
- saved-catch migration-safe parsing
- decision trace rendering data shape

## Human Review Still Needed

- A real ingestion pipeline for current FWC and NOAA rules into versioned bundles.
- Full statewide Florida species and special-area coverage.
- Official GIS or county/waterbody zone mapping instead of approximate bounding boxes.
- Human legal/compliance review of every seeded rule, effective date, note, and decision-screen disclaimer before production release.
- Device/simulator validation of the Expo camera flow; code, typecheck, and tests are verified here, but the app was not run in a simulator in this workspace.

## End State Summary

### What is complete

- Full mobile architecture for scan, confirm, measure, result, saved catches, settings, and dev inspection
- Typed regulation schema and rule engine
- Live still-image scan assistant with structured quality analysis
- Manual point-based measurement workflow on the captured image
- Richer result and catch-log persistence
- Seed Florida dataset with source attribution
- Supabase schema migration
- Admin validation scripts
- 30+ tests across rules, measurement, and parsing
- Setup and architecture documentation

### What is mocked

- Final species classifier inference accuracy is still mocked behind a production-style interface
- Fish detection is still heuristic still-image analysis, not a trained segmentation/detection model
- Streaming live inference is not enabled yet; the current implementation analyzes captured still frames
- Production Supabase sync client and admin publishing UI
- Official GIS-grade zone mapping

### What still needs official rule ingestion / legal verification

- A real ingestion pipeline for current FWC and NOAA rules into versioned bundles.
- Full statewide Florida species and special-area coverage.
- Official GIS or county/waterbody zone mapping instead of approximate bounding boxes.
- Human legal/compliance review of every seeded rule, effective date, note, and decision-screen disclaimer before production release.
- Device/simulator validation of the Expo camera flow; code, typecheck, and tests are verified here, but the app was not run in a simulator in this workspace.
- A trained on-device or server-backed fish detector/classifier before production launch.
