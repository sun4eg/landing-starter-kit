# Landing Starter Kit v2.0.0-rc.1

## 1. Summary

v2.0.0-rc.1 is the feature-frozen candidate for Landing Starter Kit v2.0.0.
It consolidates the focused navigation, fragment-scrolling, Form, and regression-test
stabilization completed after beta.2. It is suitable for final integration and
acceptance testing, but it is not the stable v2.0.0 release or a universal
browser, device, accessibility, or assistive-technology certification.

Until stable release, changes should be limited to reproduced defects, release
blockers, and release-critical documentation corrections.

## 2. What Changed Since beta.2

- Nested structural fragment targets now use the shared sticky-Header offset.
- Raised floating Form labels remain one line without changing their inactive state.
- Responsive Landing and Playground Navigation toggles now show menu/close state consistently.
- The responsive Playground Navigation uses one persistent toggle and positions its current item in view when opened.
- Floating-label and fragment assertions were made deterministic across the configured browser engines.

## 3. Navigation and In-page Navigation Stabilization

The Playground documentation panel no longer duplicates its heading and close
control: its persistent Header button opens and closes the panel, preserves its
accessible expanded state, and switches between menu and close icons. The Landing
page uses the same state-signalling principle.

When an opening Playground side Navigation is shown, its existing
`aria-current="location"` item is brought into the visible menu viewport and
centered where scroll boundaries allow. This changes only the menu container's
scroll position; focus, page position, URL, and active-section logic remain intact.

Top-level and nested fragment links retain native hashes and history while their
targets clear the sticky Header on click and direct load.

## 4. Form and Floating-label Stabilization

Raised floating labels remain a single contained line at narrow widths, preventing
long labels from colliding with preceding fields. The native `label` relationship
and full accessible name remain unchanged, as do inactive labels and existing
floating-label geometry.

## 5. Regression and Cross-engine Test Hardening

The production-build Playwright suite now contains 53 installed-Chrome cases.
The managed CI configuration enumerates 151 cases: 53 in Chromium and 49 each in
Firefox and WebKit. Forced-colors emulation remains focused on Chromium, while
accessibility-semantic, navigation, fragment, Form, layout, Modal, Toast, and Tabs
contracts run in every applicable managed engine.

Floating-label selector coverage reads compiled production CSS rather than relying
on engine-specific CSSOM serialization. Fragment checks wait on settled layout and
relative geometry without fixed sleeps, broad skips, or inflated retry policy.

The repository owner reports the current `main` GitHub Actions browser matrix green.
This is external run evidence rather than a claim that managed Firefox or WebKit
were executed on every local development host.

## 6. Manual Verification Completed

- Targeted Safari verification confirmed the prior Service Card intrinsic-height fix.
- Targeted macOS Safari + VoiceOver smoke testing reported no issue in the tested priority workflows.
- Targeted iOS Safari + VoiceOver and basic touch smoke testing reported no issue in the tested priority workflows.
- Android Chrome/touch spot checks completed so far reported no issue.

These are targeted results, not exhaustive platform or assistive-technology certification.

## 7. Remaining Manual Limitations

- Windows 11 NVDA with Chrome or Edge remains unverified.
- Physical Windows High Contrast remains unverified; Playwright forced-colors emulation is not equivalent.
- Broader Android, device, browser, and assistive-technology combinations remain non-exhaustive.
- Native Select, date/time, and file interfaces vary by platform.
- Automated DOM tests do not validate real screen-reader speech timing or verbosity.
- The Contact form requires adopter-provided backend, privacy, spam, and error handling.

## 8. RC Evaluation Guidance

Use rc.1 for final integration and acceptance testing against representative
content, deployment targets, keyboard and touch input, native controls, responsive
layouts, and project-required assistive technologies. Report reproducible defects;
defer new features, variants, and optional API cleanup until after stable v2.0.0.

## 9. Release Checklist

- [x] Package and lockfile version set to `2.0.0-rc.1`.
- [x] Production build emits landing and Playground entries.
- [x] Complete installed-Chrome suite passes.
- [x] Chromium, Firefox, and WebKit CI projects are configured.
- [x] Repository owner reports the current `main` browser workflow green.
- [x] Forced-colors emulation and accessibility-semantic regression coverage are configured.
- [x] Targeted Safari Service Card verification completed.
- [x] Targeted macOS and iOS Safari + VoiceOver smoke checks completed.
- [x] Targeted iOS and Android Chrome/touch spot checks completed so far.
- [ ] Windows 11 NVDA + Chrome/Edge pass.
- [ ] Physical Windows High Contrast pass.
- [ ] Owner review of the complete rc.1 preparation diff.
- [ ] Annotated tag and GitHub pre-release creation.
