# Landing Starter Kit v2.0.0-beta.2

## 1. Summary

v2.0.0-beta.2 is a post-beta hardening release for continued evaluation and
integration testing. It adds browser regression infrastructure, forced-colors
resilience, automated accessibility-semantic contracts, and contextual Password
Input toggle names without changing the established component APIs.

This is not the stable v2.0.0 release and does not represent universal browser,
device, assistive-technology, or WCAG certification.

## 2. Changes Since beta.1

- Added production-build browser regression testing and cross-engine CI.
- Hardened custom component states for forced-colors environments.
- Added DOM-level accessible-name, state, relationship, focus, validation, and
  live-region regression coverage.
- Preserved contextual Show/Hide accessible names for multiple Password Inputs.
- Recorded successful targeted macOS and iOS Safari + VoiceOver smoke passes.

## 3. Browser Regression Infrastructure

Playwright builds the project, serves `dist` through a deterministic local
preview, and stops the server after testing. The suite protects mobile
Navigation, Modal isolation, Modal + Toast ownership, Playground form
interception, Tabs keyboard behavior, responsive overflow, and Card intrinsic
sizing. GitHub Actions runs the applicable suite in managed Chromium, Firefox,
and WebKit with one CI retry and failure-only reports, screenshots, and traces.

Playwright WebKit is useful engine-level regression coverage; it is not physical
Safari or iOS Safari certification.

## 4. Accessibility Hardening

Component-local forced-colors rules use system color roles, visible geometry,
and explicit focus treatment without disabling platform adaptation globally.
Focused Chromium emulation covers custom controls, current states, feedback,
overlays, and featured surfaces.

Cross-engine semantic tests cover accessible names, native and ARIA states,
control relationships, focus ownership, inert isolation, native validation,
live-region markup, progress values, loading semantics, and selected static
reading-order contracts. These DOM assertions cannot verify screen-reader speech
timing, interruption, verbosity, or interaction modes.

Password Input toggles now preserve authored context when their accessible names
change between Show and Hide, making multiple instances distinguishable.

## 5. Safari Service Card Fix

The Safari Service Card intrinsic-height correction shipped in v2.0.0-beta.1:
the redundant percentage height was removed while parent Grid stretching retained
intentional equal-height rows. Beta.2 adds Chromium and WebKit-oriented regression
coverage for that contract so the previously verified fix remains protected.

## 6. Manual Verification Completed

- Targeted macOS Safari + VoiceOver smoke testing completed with no issue observed
  in the tested Navigation, Accordion, Tabs, Modal, Toast, Form Control, native
  validation, Progress, and Testimonial workflows.
- Targeted iOS Safari + VoiceOver testing completed with no issue observed in the
  tested mobile Navigation, Modal, Tabs, Toast, Modal + Toast, Range, Password
  Input, native Select/date/time/file, and validation workflows.
- A basic touch smoke was included in the targeted iOS scenarios.
- The previously reproduced Service Card stretching defect was manually confirmed
  fixed in Safari.

These are targeted smoke results, not exhaustive Safari, iOS, VoiceOver, or
all-device certification.

## 7. Known and Manual Limitations

- Windows 11 NVDA with Chrome or Edge remains unverified.
- Physical Windows High Contrast remains unverified; Playwright forced-colors
  emulation is not a substitute.
- Android Chrome/touch remains unverified.
- Broader device and assistive-technology testing remains evidence-driven.
- Native Select, date/time, and file interfaces vary by platform.
- No automated system validates actual screen-reader speech output.
- The Contact form still requires an adopter-provided backend, privacy handling,
  spam protection, and error handling.

## 8. Evaluation Guidance

Use beta.2 to evaluate integration, component composition, keyboard behavior,
native Form Controls, forced-colors resilience, and the documented APIs against
representative content. Retain physical testing for the browsers, devices,
input methods, and assistive technologies required by the target deployment.

## 9. Release Checklist

- [x] Package and lockfile version set to `2.0.0-beta.2`.
- [x] Production build emits landing and Playground entries.
- [x] Complete installed-Chrome browser suite passes.
- [x] Chromium, Firefox, and WebKit CI projects are configured.
- [x] Forced-colors emulation tests are configured for Chromium.
- [x] Accessibility-semantic tests are configured across managed engines.
- [x] Targeted Safari Service Card verification completed.
- [x] Targeted macOS Safari + VoiceOver smoke completed.
- [x] Targeted iOS Safari + VoiceOver and basic touch smoke completed.
- [ ] Windows 11 NVDA + Chrome/Edge pass.
- [ ] Physical Windows High Contrast pass.
- [ ] Android Chrome/touch pass.
- [ ] Owner review of the complete beta.2 diff.
- [ ] Annotated tag and GitHub pre-release creation.
