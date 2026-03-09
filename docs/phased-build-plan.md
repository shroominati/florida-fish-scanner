# Phased Build Plan

## Phase 0: Foundation

- Lock Expo / TypeScript / Supabase stack
- Define normalized rule schema and zone model
- Seed a Florida MVP species list and sample rule bundle
- Build a pure TypeScript rules engine with scenario tests

## Phase 1: Mobile MVP

- Home, scan, confirm species, measurement, result, saved catches, and settings screens
- Camera and location permissions
- Manual zone override and retained-count input
- Local catch saving and offline bundle read path

## Phase 2: Real Inference and Measurement

- Replace mock classifier with a model trained on Florida recreational species
- Add segmentation or keypoint assistance for body outline
- Add interactive nose/tail marker overlay on the captured image
- Evaluate AR-based calibration on supported devices

## Phase 3: Regulation Operations

- Curated ingestion workflow for official FWC pages into versioned JSON
- Supabase admin panel or internal tool for staging, diffing, and publishing bundles
- Audit log entries for every rule change and source verification event
- Device sync for fresh bundles and stale bundle warnings

## Phase 4: Hardening

- Add official GIS zone polygons
- Add NOAA offshore/federal-water rules where Florida anglers commonly cross state/federal context
- Add county, waterbody, and management-area search
- Add analytics for unknown species, low-confidence flows, and rule misses

## Phase 5: Expansion

- More Florida species and special area coverage
- Support for charter/vessel-level limits
- Other states using the same rule engine and normalized schema
