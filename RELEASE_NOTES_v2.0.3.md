# v2.0.3 — Maintenance Release

## Summary

v2.0.3 is a focused Windows High Contrast accessibility maintenance patch for the stable v2 component APIs.

## Fixed

- Checkbox checked, mixed, disabled, and focus states retain explicit, non-color-only geometry in Windows High Contrast.
- Responsive Navigation menu and close icons remain visible in forced-colors mode.
- Native date and time picker indicators remain visible and correctly positioned inside their inputs in Windows High Contrast.

## Compatibility

- No public API or markup changes.
- No JavaScript behavior changes.
- No migration is required from v2.0.2.
- Normal-color appearance remains unchanged.
- Native Checkbox, date, and time semantics and interaction remain authoritative.

## Validation

- Production build emits both landing and Playground HTML entry points.
- Installed-Chrome regression suite: 56 tests passed.
- Managed CI configuration: 56 Chromium, 51 Firefox, and 51 WebKit tests (158 total across 8 files).
- The repository owner reports that the Chromium, Firefox, and WebKit CI matrix passed on the High Contrast fix commit.
- A targeted physical Windows Chrome + High Contrast Black retest confirmed all four remediated scenarios. Chromium forced-colors emulation remains supplementary regression coverage, not universal Windows High Contrast certification.

## Remaining manual gap

- Windows NVDA verification remains pending; broader Windows browser, theme, device, and assistive-technology coverage is not implied by the targeted pass.

## Upgrade

Projects using v2.0.2 can upgrade directly to v2.0.3 without component markup, API, or integration changes.
