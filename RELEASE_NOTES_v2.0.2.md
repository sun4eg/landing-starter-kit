# v2.0.2 — Maintenance Release

## Summary

v2.0.2 is a focused Modal reflow and accessibility maintenance patch for the stable v2 component APIs.

## Fixed

- Modal footer actions remain reachable in unusually short, high-reflow viewports because the dialog can scroll vertically while preserving horizontal clipping.

## Compatibility

- No public API or markup changes.
- No migration is required from v2.0.1.
- Existing Modal focus ownership, background isolation, page scroll locking, Toast coordination, and normal-height layout remain unchanged.

## Validation

- Production build emits both landing and Playground HTML entry points.
- Installed-Chrome regression suite: 55 tests passed.
- Managed CI configuration: 55 Chromium, 51 Firefox, and 51 WebKit tests (157 total across 8 files).
- The repository owner reports that the Chromium, Firefox, and WebKit CI matrix passed on the Modal fix commit.
- An actual Chrome 200% browser-zoom check confirmed that the Modal remained usable and both footer actions were reachable and operable.
- A 360×225 short-height reflow proxy and regression test cover the 400%-equivalent layout condition. True Chrome 400%, Firefox, and Safari browser-zoom verification remains manual and is not claimed by this release.

## Upgrade

Projects using v2.0.1 can upgrade directly to v2.0.2 without component markup, API, or integration changes.
