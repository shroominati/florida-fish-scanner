# Florida Fish Scanner Architecture

## Stack

- Mobile client: Expo + React Native + TypeScript
- Data/backend: Supabase Postgres with versioned rule bundles and audit logs
- Rules engine: pure TypeScript module shared by UI, tests, admin tooling, and future backend APIs
- On-device capabilities: Expo Camera, Expo Location, AsyncStorage for offline catch storage
- ML strategy: pluggable classifier interface with an MVP mock implementation that can be replaced by on-device or hybrid inference later

## Core Design Decision

This app is a regulation decision system, not just a classifier. The mobile UI is only a thin layer over three core services:

1. Species identification
2. Measurement calibration
3. Regulation evaluation

The decision engine returns `LEGAL`, `ILLEGAL`, or `UNCERTAIN` together with a human-readable trace. `LEGAL` is reserved for cases where:

- species is manually confirmed or above threshold
- length is manually adjusted or above threshold
- a rule version exists for the exact place, date, and fishing context
- the cached rules are still within freshness policy

## Layers

### 1. Presentation

- [`App.tsx`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/App.tsx) holds the finite scan flow for the starter app
- [`src/screens/HomeScreen.tsx`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/screens/HomeScreen.tsx)
- [`src/screens/ScanScreen.tsx`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/screens/ScanScreen.tsx)
- [`src/screens/ReviewSpeciesScreen.tsx`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/screens/ReviewSpeciesScreen.tsx)
- [`src/screens/MeasureScreen.tsx`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/screens/MeasureScreen.tsx)
- [`src/screens/ResultScreen.tsx`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/screens/ResultScreen.tsx)
- [`src/screens/SavedCatchesScreen.tsx`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/screens/SavedCatchesScreen.tsx)
- [`src/screens/SettingsScreen.tsx`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/screens/SettingsScreen.tsx)

### 2. Domain

- [`src/types/domain.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/types/domain.ts) defines the normalized contracts
- [`src/features/regulations/ruleEngine.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/features/regulations/ruleEngine.ts) is the authoritative decision engine
- [`src/features/regulations/zoneResolver.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/features/regulations/zoneResolver.ts) resolves approximate Florida zones from GPS
- [`src/features/measurement/measurementEngine.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/features/measurement/measurementEngine.ts) computes calibrated total length and uncertainty
- [`src/features/classifier/mockClassifier.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/features/classifier/mockClassifier.ts) is the pluggable classifier boundary

### 3. Data

- [`src/data/species.json`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/data/species.json)
- [`src/data/regulationRules.json`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/data/regulationRules.json)
- [`src/data/zones.json`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/data/zones.json)
- [`src/data/ruleVersions.json`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/data/ruleVersions.json)
- [`src/data/sources.json`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/data/sources.json)

The bundle is versioned and source-attributed so rule updates remain data-driven rather than hardcoded in UI components.

### 4. Storage and Sync

- Local catch persistence: [`src/features/storage/catchStore.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/features/storage/catchStore.ts)
- Supabase schema: [`supabase/migrations/202603081130_init.sql`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/supabase/migrations/202603081130_init.sql)
- Admin bundle validation: [`scripts/validate-rules.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/scripts/validate-rules.ts)
- Bundle metadata build: [`scripts/build-rule-bundle.ts`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/scripts/build-rule-bundle.ts)

## Offline-First Strategy

- Ship a bundled Florida MVP rule snapshot in the app
- Cache the current published bundle locally
- Save catches to device storage immediately
- Permit manual zone override if GPS is missing
- Mark results as `UNCERTAIN` when the bundle is stale or the exact rule is missing

## Measurement Strategy

MVP measurement is user-assisted. The app does not pretend computer vision is exact enough on its own.

- auto estimate from fish pixel span / reference pixel span
- manual confirmation toggle when the angler aligns nose and tail
- stored confidence and uncertainty band
- rule engine treats boundary-crossing measurements as `UNCERTAIN`

## ML Strategy

The current classifier is intentionally isolated behind a function boundary. Replace [`classifyFishPhoto()`](/Users/alfredmunoz/Documents/Playground/florida-fish-scanner/src/features/classifier/mockClassifier.ts) with:

- a TensorFlow Lite or Core ML / NNAPI model on-device
- a hybrid Supabase Edge Function or inference API
- a candidate re-ranker for visually similar species

The UI and rules engine do not need to change if the output contract stays stable.

## Known MVP Constraints

- A real ingestion pipeline for current FWC and NOAA rules into versioned bundles is not implemented yet
- Full statewide Florida species and special-area coverage is not complete yet
- Official GIS or county/waterbody zone mapping has not replaced the approximate bounding boxes yet
- Human legal/compliance review of seeded rules, effective dates, notes, and decision disclaimers is still required before production release
- Device/simulator validation of the Expo camera flow has not been completed in this workspace
- The starter classifier is mocked
- The camera flow is real, but measurement point selection is form-driven rather than image-overlay based
- Rule data is a curated snapshot, not a production ingestion pipeline yet
