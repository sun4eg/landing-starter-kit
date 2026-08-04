# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [Unreleased]

### Added

- Added a reusable Badge component with semantic visual variants, outline, small and pill options, optional icons, resilient inline composition, and complete Playground documentation.
- Added a contextual Alert component with semantic and outline variants, optional icons and actions, progressive dismissal, live-region guidance, and complete Playground documentation.
- Added a semantic Divider component with horizontal, strong, labelled, and bounded vertical forms plus complete Playground guidance.
- Added a determinate Progress component with size and semantic variants, optional visible labels and values, accessible custom progressbar semantics, and complete Playground documentation.

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
