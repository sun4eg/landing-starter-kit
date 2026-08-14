# Landing Starter Kit v2.0.0

## 1. Summary

v2.0.0 is the stable release of the Landing Starter Kit component system and its
documented v2 APIs. It combines a reusable production landing page, a multi-page
Component Playground, semantic design tokens, native-first interaction patterns,
and production-build browser regression coverage.

Stable means the documented v2 API is the supported current surface. It does not
mean every deployment, browser/device combination, assistive technology, or native
platform control has been universally certified.

## 2. What v2.0.0 Includes

- Token-driven Sass architecture with semantic color and layout roles.
- Reusable page foundations, responsive layout utilities, Header, Navigation, Footer, and landing sections.
- Native-first Form Controls with validation, labels, descriptions, disabled states, and progressive enhancements.
- Feedback, loading, navigation, overlay, Card, marketing, and content components.
- Reduced-motion, dynamic viewport, forced-colors, focus, fragment-offset, and responsive-containment foundations.
- Coordinated Navigation, Modal, and Toast focus, inertness, and scroll-lock ownership.

## 3. Component and Playground Coverage

The production set includes Button, Accordion, Tabs, Breadcrumbs, Pagination,
Form and its complete native control family, Badge, Alert, Divider, Progress,
Spinner, Skeleton, Empty State, Toast, Modal, Service Card, Project Card, Pricing
Card, Stats, Timeline, Logo Cloud, CTA Banner, and Testimonial, plus reusable page
sections and layout foundations.

`playground.html` documents the shipped APIs, states, composition patterns,
accessibility guidance, responsive behavior, native-platform differences, design
tokens, and resilience examples. The Vite build emits both landing and Playground
entry points.

## 4. Interaction and Accessibility Hardening

The beta and RC cycle stabilized Modal isolation, mobile Navigation containment,
Navigation-to-Modal ownership, actionable Toast isolation, Playground demo forms,
sticky-Header fragment positioning, responsive Navigation toggles/current-item
visibility, floating-label containment, contextual Password Input names, and
Safari-sensitive Card intrinsic sizing.

Forced-colors rules preserve essential geometry with system colors without
disabling platform adaptation globally. Automated semantic checks protect names,
roles, states, relationships, focus ownership, inertness, native validation,
live-region markup, progress values, and selected reading-order contracts.

## 5. Browser Regression Coverage

Playwright builds and serves production output through a deterministic local
preview. The installed-Chrome suite contains 53 tests. The CI configuration
enumerates 151 cases: 53 in Chromium and 49 each in Firefox and WebKit. Coverage
includes Navigation, Modal/Toast, Forms, Tabs, layout/overflow, fragments,
forced-colors emulation, accessibility semantics, Card sizing, and Playground
current-item positioning.

The exact v2.0.0-rc.1 commit passed the owner-confirmed Chromium, Firefox, and
WebKit GitHub Actions matrix before tagging. Playwright WebKit is useful engine
coverage but is not equivalent to physical Safari certification.

## 6. Manual Platform Verification Completed

- Targeted Safari verification confirmed the Service Card intrinsic-height correction.
- Targeted macOS Safari + VoiceOver smoke testing reported no issue in tested priority workflows.
- Targeted iOS Safari + VoiceOver and touch smoke testing reported no issue in tested priority workflows.
- Android Chrome/touch spot checks completed so far reported no issue.

These results are targeted rather than exhaustive certification.

## 7. Known Limitations and Manual Gaps

- Windows 11 NVDA with Chrome or Edge remains unverified.
- Physical Windows High Contrast remains unverified; forced-colors emulation is not equivalent.
- Broader Android, device, browser, and assistive-technology combinations remain non-exhaustive.
- Automated DOM checks do not validate actual screen-reader speech timing, interruption, or verbosity.
- Native Select, date/time, and file interfaces intentionally vary by platform.
- The Contact form requires an adopter-provided backend, privacy handling, spam protection, and error handling.

## 8. Upgrade and Evaluation Guidance

Projects evaluating a beta or RC build should update to v2.0.0 and verify any
local overrides against the documented Playground APIs. No public API change was
introduced between rc.1 and stable. Continue deployment-specific testing for the
required browsers, devices, input methods, native controls, content, and assistive
technologies.

Future feature or API work should target a separately reviewed post-2.0 release;
stable maintenance should remain evidence-driven.

## 9. Stable Release Checklist

- [x] Package and lockfile version set to `2.0.0`.
- [x] Production build emits landing and Playground entries.
- [x] Complete installed-Chrome suite passes.
- [x] Chromium, Firefox, and WebKit CI projects are configured.
- [x] Exact rc.1 commit passed the owner-confirmed managed-engine CI matrix.
- [x] Forced-colors emulation and accessibility-semantic regression coverage are configured.
- [x] Targeted Safari Service Card, macOS/iOS VoiceOver, and touch checks completed.
- [x] Android Chrome/touch spot checks completed so far.
- [ ] Owner review of the complete stable preparation diff.
- [ ] Chromium, Firefox, and WebKit CI green on the exact stable preparation commit.
- [ ] Annotated stable tag and GitHub Release creation.
