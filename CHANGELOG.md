# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [Unreleased]

### Added

- Added an accessible authored-DOM Tooltip component for concise supplemental text on enabled buttons and links, with keyboard and fine-pointer behavior plus viewport-safe positioning.

## [2.1.0] - 2026-08-22

### Added

- Added logical inline-end and inline-start Drawer presentations to Modal for blocking task-oriented side panels while reusing the existing dialog lifecycle, accessibility behavior, and data API.

## [2.0.3] - 2026-08-21

### Fixed

- Improved Checkbox state legibility in Windows High Contrast by preserving explicit checked, mixed, disabled, and focus geometry.
- Restored responsive Navigation toggle icon visibility in forced colors.
- Corrected native date and time picker-indicator visibility and positioning in Windows High Contrast while preserving native interaction.

## [2.0.2] - 2026-08-20

### Fixed

- Kept Modal footer actions reachable in unusually short, high-reflow viewports by allowing dialog-level vertical scrolling while preserving horizontal clipping.

## [2.0.1] - 2026-08-16

### Fixed

- Corrected Spinner alignment inside Button content while preserving standalone Spinner positioning and behavior.

## [2.0.0] - 2026-08-14

> Stable v2 component-system release. The documented component APIs are the
> supported v2 surface; platform-specific manual limitations remain documented.

### Highlights

- Completed the production component system and multi-page Component Playground with documented APIs, responsive examples, native Form Controls, feedback, overlays, navigation, and marketing/content compositions.
- Established semantic design-token architecture, dynamic viewport geometry, reduced-motion and forced-colors resilience, and coordinated Navigation, Modal, and Toast isolation.
- Added production-build Playwright regression infrastructure covering 53 installed-Chrome cases and 151 configured Chromium, Firefox, and WebKit CI cases.

### Fixed and Stabilized

- Stabilized sticky-Header fragment positioning, responsive Navigation state/current-item behavior, floating-label containment, Playground form interception, and Safari-sensitive intrinsic Card sizing.
- Preserved native semantics, validation, focus ownership, accessible names and states, live-region boundaries, and one-active-context behavior across high-risk interactions.

### Testing and Accessibility

- Retained Chromium forced-colors emulation and cross-engine semantic, focus, Navigation, fragment, Form, Modal, Toast, Tabs, layout, and responsive-overflow regression coverage.
- Completed targeted Safari Service Card, macOS Safari + VoiceOver, iOS Safari + VoiceOver/touch, and Android Chrome/touch spot checks with no issue reported in the tested scenarios.
- Kept Windows NVDA, physical Windows High Contrast, exhaustive device coverage, and real screen-reader speech behavior as explicit manual gaps rather than certification claims.

## [2.0.0-rc.1] - 2026-08-14

> Feature-frozen release candidate for final integration and acceptance testing.
> Windows NVDA and physical Windows High Contrast remain documented manual gaps.

### Fixed

- Applied the shared sticky-header scroll offset to nested structural fragment targets so in-page guidance and subsection headings remain visible after link activation or direct hash loading.
- Kept raised floating Form labels on one line at narrow mobile widths without changing their inactive state or existing notch treatment.

### Changed

- Simplified the responsive Playground Navigation to one persistent Header toggle and made both responsive Navigation toggles switch from menu to close icons while open.
- Playground side Navigation now brings the current section into view when opened.

### Testing

- Stabilized floating-label coverage by separating runtime behavior assertions from compiled autofill-selector checks instead of relying on cross-engine CSSOM serialization.
- Stabilized fragment navigation coverage around settled font/layout geometry without fixed sleeps or engine skips.
- Expanded the browser suite to 53 installed-Chrome tests and 151 managed CI cases across Chromium, Firefox, and WebKit configurations.

## [2.0.0-beta.2] - 2026-08-13

> Post-beta hardening release for continued evaluation and integration testing.
> Windows NVDA, physical Windows High Contrast, and Android device/touch
> verification remain pending and are not represented by browser emulation.

### Fixed

- Preserved contextual Password Input toggle names while synchronizing Show/Hide state, preventing repeated generic toggle names in multi-instance interfaces.

### Accessibility

- Hardened custom controls, focus indicators, feedback geometry, progress/loading states, and selected or featured surfaces with component-local system-color behavior for forced-colors environments.
- Added focused Chromium forced-colors emulation coverage and cross-engine DOM-level regression coverage for accessible names, roles, state relationships, focus ownership, native validation, and live-region markup.
- Completed targeted macOS Safari + VoiceOver and iOS Safari + VoiceOver smoke passes with no issue observed in the tested priority workflows; the iOS pass also included a basic touch smoke.

### Testing and Tooling

- Added a production-build Playwright regression suite for mobile Navigation, Modal and Toast coordination, Playground forms, Tabs, responsive overflow, and the Safari-sensitive Service Card intrinsic-height contract already fixed in beta.1.
- Added stable local installed-Chrome commands and GitHub Actions coverage in Playwright-managed Chromium, Firefox, and WebKit, with deterministic preview lifecycle and failure-only artifacts.
- Documented the distinction between Playwright WebKit and physical Safari, forced-colors emulation and physical Windows High Contrast, and DOM assertions and real screen-reader output.

## [2.0.0-beta.1] - 2026-08-12

> Beta release: automated production-build and Chrome regression checks pass.
> Manual Safari, Firefox, mobile-platform, forced-colors, VoiceOver, and NVDA
> verification remains recommended before production adoption.

### Added

- Expanded the production library and Component Playground with Badge, Alert, Divider, Progress, Spinner, Skeleton, Empty State, Tabs, Modal, Toast, Breadcrumbs, Pagination, Pricing Card, Stats, Timeline, Logo Cloud, and CTA Banner.
- Added complete Playground documentation for Testimonial, covering its production API, semantic attribution, composition, content resilience, accessibility, and intentional limitations.

### Changed

- Migrated production component color consumption to purpose-led semantic roles while retaining centralized primitive palette definitions.
- Kept legacy viewport-height fallback behavior while progressively using the dynamic viewport for Modal and Toast bounds in supporting browsers.
- Synchronized the README component inventory with the production and Playground component set.

### Fixed

- Isolated open Modal dialogs from external page and Toast controls while preserving focus restoration, Toast lifecycle state, and pre-existing inert ownership.
- Contained focus within the full-screen mobile Primary Navigation, isolated and scroll-locked obscured content, and coordinated ownership with Modal and Toast layers.
- Prevented Playground demonstration forms from navigating or exposing entered values while preserving browser-native constraint validation.
- Corrected post-remediation visual regressions in focus-ring visibility and kept Alert and Spinner optical alignment within the token-only styling contract.
- Removed Service Card's ambiguous percentage block size so intrinsic Card compositions no longer over-resolve auto-sized Grid rows in Safari while parent grids retain intentional equal-height stretching.

### Verification

- Passed production builds, structural validation, JavaScript syntax checks, and targeted automated Chrome QA for focus, responsive containment, component alignment, and reduced motion.
- Confirmed through targeted manual Safari smoke testing that the reproduced Service Card composition no longer stretches beyond its content.
- Retained manual cross-browser, device, forced-colors, and assistive-technology verification as an explicit pre-publication recommendation.

## [2.0.0-alpha.1] - 2026-08-04

> Alpha release: manual Safari, Firefox, mobile-platform, forced-colors, VoiceOver,
> and NVDA verification remains recommended before production adoption.

### Added

- Added a multi-page Component Playground with living documentation for reusable components, typography, navigation, Footer patterns, and design tokens.
- Added Playground documentation navigation with synchronized current-section state across desktop and mobile presentations.
- Added native Checkbox, Radio, and Switch components with complete Form Controls Playground documentation.
- Added a native Select component with required, disabled, long-content, optgroup, and validation documentation.
- Added a native Password Input with an accessible show/hide enhancement, autocomplete guidance, and Playground validation examples.
- Added a native Number Stepper with accessible step controls, boundary synchronization, decimal stepping, and Playground validation guidance.
- Added a native Range Slider with live output, optional unit suffixes, progress enhancement, and cross-browser Playground documentation.
- Added a native Date Picker with required, optional, disabled, readonly, bounded-date, and validation documentation.
- Added a native Time Picker with interval, working-hours, native-state, and validation documentation.
- Added a native DateTime Local component with scheduling boundaries, intervals, native states, and validation documentation.
- Added a native File Input with single and multiple selection, accepted-type guidance, native validation, and Playground documentation.
- Added multi-page Vite output for the landing page and Component Playground.

### Changed

- Refined the shared mobile Header navigation into an edge-to-edge viewport panel below the sticky Header.
- Clarified the Button size scale and shared control foundations for small, medium, and large controls.
- Expanded the Playground into complete living documentation for existing production components, public APIs, responsive behavior, native states, and design-token foundations.

### Fixed

- Corrected Footer heading contrast and Playground documentation accuracy, responsive resilience, semantic relationships, and navigation state synchronization.
- Preserved native Form label activation, corrected Switch directionality, kept Number Stepper focus visible within its clipped boundary, aligned File Input control height, and removed redundant Form Controls labelling ARIA.

### Accessibility

- Preserved native control semantics, validation, keyboard behavior, labels, descriptions, and form submission across the Form Controls family.
- Refined mobile navigation focus order, Escape handling, accessible toggle labels, full-row targets, and full-viewport coverage below the sticky Header.
- Added reduced-motion-aware interactions, visible focus handling, and synchronized `aria-current="location"` documentation navigation state.

### Documentation

- Documented production BEM and data-attribute contracts, progressive enhancement, native browser differences, content resilience, and intentional limitations.
- Added responsive and accessibility guidance for the complete Form Controls foundation and existing landing components.

## [1.1.0] - 2026-08-02

### Added

- Responsive Header and Primary Navigation with a progressively enhanced mobile menu.
- Optional sticky Header with a scroll-activated shadow.
- Reusable Hero, Services, Benefits, Portfolio, Process, Reviews, FAQ, Contact, and Footer sections.
- Accessible Accordion with readable no-JavaScript fallback, single-open and multiple-open modes, and focus-safe panel closing.
- Sticky FAQ contact CTA that remains below the Header on desktop and returns to document flow on smaller screens.
- Reusable Contact Form with native validation and outlined floating labels; no submission backend is included.
- Reusable Button, Text, Section Heading, Service Card, Project Card, Testimonial, Primary Navigation, and layout utilities.
- Semantic design tokens, shared Sass breakpoints, responsive typography, containers, grids, and sticky-position tokens.
- Skip-to-content navigation, visible focus foundations, anchor offsets, reduced-motion support, and semantic page landmarks.
- Project guidance in `AI_RULES.md`, `ARCHITECTURE.md`, `COMPONENT_STANDARDS.md`, `DESIGN_TOKENS.md`, `ROADMAP.md`, and `README.md`.

### Changed

- Unified production section spacing through the shared Section utility.
- Separated Primary Navigation, Service Card, and Project Card styles into focused component boundaries.
- Refined semantic token relationships for sticky positioning, anchor scrolling, controls, surfaces, and layout measures.
- Moved long-label wrapping and multi-line spacing resilience into the reusable Button component.
- Replaced legacy project naming with the theme-neutral Landing Starter Kit identity.
- Added production-oriented page metadata and deployment guidance while leaving domain- and brand-specific configuration to adopters.

### Fixed

- Corrected mobile navigation semantics, collapsed-menu focusability, Escape handling, and focus restoration.
- Corrected the document language and mixed-language FAQ CTA content.
- Prevented sticky Header overlap at anchor and Skip-to-content destinations.
- Kept the sticky FAQ CTA below the Header through shared sticky-position tokens.
- Hid the Skip link during normal viewing while preserving its keyboard-focused state and destination.
- Corrected floating-label empty, focused, filled, invalid-entry, textarea, and autofill state synchronization.
- Increased form-control boundary contrast without changing native validation behavior.
- Replaced ambiguous repeated card links with destination-specific link text.
- Removed duplicated focus rules, media reset declarations, section spacing, and consumer-specific Button resilience rules.
- Made Accordion, Navigation, and Sticky Header initialization safe to repeat without duplicate enhancement.

### Security

- Changed the Contact form to POST so submitted personal data is not placed in the URL; an approved form action is still required before deployment.
