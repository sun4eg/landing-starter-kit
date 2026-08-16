# v2.0.1 — Maintenance Release

v2.0.1 is a focused stable maintenance release for Landing Starter Kit. It preserves the documented v2 APIs and existing component behavior while correcting one composition-level alignment issue.

## Fixed

- Corrected Spinner alignment inside Button content while preserving standalone Spinner positioning and behavior.

## Compatibility

- No public API or markup changes.
- Standalone Small, default, and Large Spinner behavior is unchanged.
- Spinner animation and reduced-motion behavior are unchanged.
- No migration is required from v2.0.0.

## Validation

- Production build emits both landing and Playground HTML entry points.
- Installed-Chrome regression suite: 54 tests passed.
- Managed CI configuration: 54 Chromium, 50 Firefox, and 50 WebKit tests (154 total across 8 files).
- The exact v2.0.1 preparation commit must pass the Chromium, Firefox, and WebKit GitHub Actions matrix before tagging.

## Upgrade

Projects using v2.0.0 can upgrade directly to v2.0.1 without component markup, API, or integration changes.
