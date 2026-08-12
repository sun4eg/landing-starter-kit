# Landing Starter Kit Roadmap

This roadmap tracks the development of a reusable, accessible, and production-ready landing page foundation.

## Current Progress

- [x] **Project initialization** — Establish the project repository and its minimal working structure.
- [x] **Vite setup** — Provide development, production build, and local preview workflows with Vite.
- [x] **Sass architecture** — Organize styles into modular `abstracts`, `base`, `layout`, `components`, and `sections` layers connected through `@use`.
- [x] **Design system foundation** — Define reusable design tokens, responsive typography, global styles, and core utility classes.
- [x] **AI development rules** — Document the technical constraints and completion requirements for AI-assisted development.

## Planned Development

- [x] **HTML foundation** — Create the semantic document structure, shared metadata, landmarks, and content hierarchy.
- [x] **UI kit** — Build reusable, token-driven interface elements and document their states and variants.
- [x] **Component Playground** — Complete living documentation, responsive navigation, active-section tracking, component APIs, and design-token references.
- [x] **Layout system** — Establish responsive grids, content wrappers, flow utilities, and consistent layout patterns.
- [x] **Header and navigation** — Implement an accessible responsive header with primary navigation and mobile behavior.
- [x] **Hero section** — Create a flexible introductory section with a clear value proposition and primary actions.
- [x] **Services section** — Provide a reusable structure for presenting services, products, or core offerings.
- [x] **Benefits section** — Present key advantages and supporting information in a concise, adaptable layout.
- [x] **Portfolio section** — Build a responsive showcase for projects, case studies, or selected work.
- [x] **Process section** — Describe a sequence of steps or workflow with clear semantic relationships.
- [x] **Reviews section** — Add an accessible pattern for testimonials, ratings, and customer attribution.
- [x] **FAQ section** — Implement a keyboard-accessible question-and-answer disclosure pattern.
- [x] **Contact form** — Create an accessible reusable form with native validation and a backend-ready structure.
- [x] **Form controls** — Complete the native Checkbox, Radio, Switch, Select, Password Input, Number Stepper, Range Slider, Date Picker, Time Picker, DateTime Local, and File Input APIs, enhancements, validation examples, and Playground documentation.
- [x] **Footer** — Add reusable secondary navigation, contact details, copyright, and an extensible lower row.
- [x] **JavaScript modules** — Implement small independent ES Modules for interactive behaviors and shared utilities.
- [x] **Source-level accessibility audit** — Verify keyboard navigation, focus management, semantics, contrast, and motion preferences while retaining platform assistive-technology checks as manual beta verification.
- [x] **v2.0.0-alpha.1 preparation** — Version and document the first evaluation release of the completed Playground and Form Controls foundations.
- [x] **Beta architecture and blocker remediation** — Complete Modal and mobile Navigation isolation, Playground form interception, semantic-token migration, dynamic viewport enhancement, and source-level beta-readiness reconciliation.
- [x] **Complete beta component documentation** — Document the expanded component set, including Testimonial, and synchronize the README and Playground inventories.
- [x] **v2.0.0-beta.1 preparation** — Version and document the beta evaluation and integration-testing milestone.
- [x] **Initial browser regression coverage** — Add a production-build Playwright/Chromium suite for high-risk Navigation, Modal, Toast, form, Tabs, Card-sizing, and responsive-overflow contracts.
- [x] **Cross-engine browser CI** — Run the browser regression suite in Playwright-managed Chromium, Firefox, and WebKit on pushes and pull requests targeting `main`.
- [x] **Automated forced-colors hardening** — Add component-level system-color fallbacks and focused Chromium emulation coverage for custom controls, current states, feedback, overlays, and featured surfaces.
- [x] **Automated AT-semantic regression coverage** — Protect accessible names, roles, state and relationship synchronization, focus ownership, inertness, native validation, and live-region markup across the Playwright browser matrix.
- [x] **Targeted macOS VoiceOver verification** — Complete a Safari + VoiceOver smoke pass across priority Navigation, disclosure, Modal, Toast, Form Control, validation, Progress, and Testimonial workflows with no issue observed in the tested scenarios.
- [ ] **SEO setup** — Add metadata, social previews, canonical information, structured data, sitemap, and robots directives.
- [ ] **Performance optimization** — Optimize images, fonts, asset delivery, rendering behavior, and Core Web Vitals.
- [ ] **Remaining beta platform verification** — Complete iOS VoiceOver, Windows NVDA, physical Windows High Contrast, Android/touch, and any broader platform checks indicated by beta feedback.
- [ ] **Expanded browser regression coverage** — Add further engine-specific scenarios where beta feedback identifies concrete interoperability risks.
- [ ] **Post-beta API hardening** — Review optional API naming consistency before stable v2.0.0.
- [ ] **Production readiness** — Complete content checks, error handling, performance review, build verification, and deployment documentation.

## Next Component Phase

1. Badge — completed
2. Alert — completed
3. Divider — completed
4. Progress — completed
5. Spinner — completed
6. Skeleton — completed
7. Empty State — completed
8. Tabs — completed
9. Breadcrumbs — completed
10. Pagination — completed
11. Timeline — completed
12. Modal — completed
13. Toast — completed
14. Tooltip
15. Popover
16. Drawer
17. Stats — completed
18. Logo Cloud — completed
19. CTA Banner — completed
20. Pricing Card — completed
