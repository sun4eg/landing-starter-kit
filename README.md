# Landing Starter Kit

An AI-ready foundation for modern, accessible, responsive landing pages, built with Vite, token-driven Sass, BEM, semantic HTML, and vanilla JavaScript ES Modules—without a UI framework.

[![Version 2.0.0](https://img.shields.io/badge/version-2.0.0-0A7EA4)](./CHANGELOG.md) [![MIT License](https://img.shields.io/badge/license-MIT-green)](./LICENSE) [![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vite.dev/) [![Sass](https://img.shields.io/badge/Sass-1.102-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/) [![JavaScript ES Modules](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) [![Accessibility](https://img.shields.io/badge/Accessibility-A11y-005A9C)](https://www.w3.org/WAI/) [![AI Ready](https://img.shields.io/badge/AI-Ready-8A2BE2)](./AI_RULES.md)

> `v2.0.0` is the stable release of the documented v2 component APIs. Automated
> regression and targeted platform testing support this release, while deployment-specific
> browser, device, forced-colors, and assistive-technology verification remains recommended.

## Included

- Hero, Services, Benefits, Portfolio, Process, Reviews, FAQ, and Contact sections
- Foundations and layout: semantic design tokens, responsive typography, containers, layout utilities, breakpoints, Text, Section Heading, Header, Primary Navigation, and Footer
- Actions and navigation: Button, Accordion, Tabs, Breadcrumbs, and Pagination
- Forms: Form plus native Checkbox, Radio, Switch, Select, Password Input, Number Stepper, Range Slider, Date Picker, Time Picker, DateTime Local, and File Input controls
- Feedback and states: Badge, Alert, Divider, Progress, Spinner, Skeleton, Empty State, and Toast
- Overlays: Modal
- Marketing and content: Service Card, Project Card, Pricing Card, Stats, Timeline, Logo Cloud, CTA Banner, and Testimonial
- Keyboard-accessible navigation and Accordion behavior
- Sticky Header, anchor offsets, reduced-motion handling, and visible focus foundations
- A living Component Playground with API, state, accessibility, responsive, and design-token documentation

## Requirements

- Node.js 20.19 or newer (or Node.js 22.12 or newer)
- npm

## Getting started

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

The multi-page build emits `dist/index.html` for the landing page and
`dist/playground.html` for the Component Playground. During development, open
`/playground.html` to review the documented components.

Preview the generated build locally with:

```bash
npm run preview
```

## Testing

Install dependencies, ensure Google Chrome is available, then run the local
Chromium regression suite with:

```bash
npm run test
```

`npm run test:browser:chrome` runs that installed-Chrome target directly, while
`npm run test:browser:headed` keeps it visible for local diagnosis. On hosts
that support Playwright-managed browsers, install them with
`npx playwright install --with-deps` and use `npm run test:browser` to run the
configured Chromium, Firefox, and WebKit projects.

Run one managed engine with:

```bash
npm run test:browser -- --project=chromium
npm run test:browser -- --project=firefox
npm run test:browser -- --project=webkit
```

The runner builds the project, serves `dist` on a deterministic local port, and
stops the preview server after the tests finish; no manually started server is
required.

GitHub Actions runs the complete suite in Playwright-managed Chromium, Firefox,
and WebKit on pushes and pull requests targeting `main`. Coverage protects
mobile Navigation isolation, Modal and Toast coordination, Playground demo-form
interception, Tabs keyboard behavior, Card intrinsic sizing, and page-level
responsive overflow. Playwright WebKit regression coverage is not physical
Safari certification; automated tests complement rather than replace physical
Safari, mobile-device, forced-colors, and assistive-technology verification.

The Chromium project also runs a focused emulated forced-colors suite for custom
controls, current states, feedback, Modal boundaries, and featured marketing
surfaces. Emulation is regression coverage, not Windows High Contrast
certification.

The cross-engine suite also checks important DOM-level accessibility contracts:
names, roles, state synchronization, ARIA relationships, focus ownership,
inertness, native validation, and live-region markup. These assertions cannot
verify spoken output, announcement timing, or a screen reader's interaction
model, so the following physical assistive-technology passes remain necessary.

Targeted macOS and iOS Safari + VoiceOver smoke passes have been completed for
priority Navigation, disclosure, Tabs, Modal, Toast, Form Control, validation,
Progress, and reading-order workflows, with no issue observed in the tested
scenarios. The iOS pass included a basic touch smoke, and Android Chrome/touch
spot checks completed so far reported no issue. This is focused
verification, not complete Safari, iOS, or VoiceOver certification. Windows
NVDA and physical Windows High Contrast remain pending; broader Android and
device coverage remains evidence-driven.

### Windows High Contrast manual checklist

On Windows 11 with a High Contrast theme enabled, verify in Edge or Chrome and,
where practical, Firefox:

- Checkbox and Radio: unchecked/checked/indeterminate geometry, disabled state, and keyboard focus.
- Switch: off/on thumb position, track boundary, disabled state, and keyboard focus.
- Select, Range, and File Input: visible affordance, selected/value state, native operation, and focus.
- Tabs and Pagination: selected/current geometry plus keyboard focus.
- Modal: dialog boundary, close/action focus, isolation, and restoration.
- Alert and Toast: readable text, visible icons/boundaries, actions, and dismiss controls.
- Progress and Spinner: visible track/fill or ring geometry and reduced-motion combination.
- With NVDA, spot-check names and states for the custom controls, Tabs, Modal, and actionable Toast.

These physical Windows and NVDA checks remain incomplete until performed on an
actual Windows system.

### VoiceOver and NVDA manual checklist

Completed targeted macOS VoiceOver + Safari smoke coverage included Primary
Navigation expanded state, Accordion disclosure, Tabs selection and navigation,
Modal context/isolation/close/restoration, Toast announcement and focus behavior,
Password Input names and state, Number Stepper, Range, Select, File Input, native
validation, Progress, and Testimonial reading order. No issue was observed in
these tested workflows.

Completed targeted iOS VoiceOver + Safari coverage included mobile Navigation,
Modal, Tabs, Toast, Modal + Toast isolation, Range, Password Input naming,
native Select/date/time/file controls, native validation, and a basic touch
smoke. No issue was observed in these tested workflows. With Windows 11 NVDA
and Chrome or Edge, verify Navigation, Accordion, Tabs, Modal, Toast,
Checkbox/Radio/Switch, Password Input, Number Stepper, Range, File Input, native
validation, and Progress; combine this with the High Contrast spot checks where
practical. The Windows checks remain incomplete until executed on the named
platform; broader Android/device coverage remains non-exhaustive despite the
completed Android Chrome/touch spot checks.

## Project structure

```text
src/
├── js/
│   └── modules/       Progressive-enhancement modules
└── scss/
    ├── abstracts/     Tokens, breakpoints, functions, and mixins
    ├── base/          Reset, typography, and global foundations
    ├── layout/        Containers, utilities, Header, and Footer
    ├── components/    Reusable UI components
    └── sections/      Landing-page section composition
```

The stylesheet entry point is `src/scss/main.scss`; the JavaScript entry point is `src/main.js`.

## Architecture

- [Architecture](./ARCHITECTURE.md)
- [Component standards](./COMPONENT_STANDARDS.md)
- [Design tokens](./DESIGN_TOKENS.md)
- [AI development rules](./AI_RULES.md)
- [Roadmap](./ROADMAP.md)

## Before deploying a commercial site

The repository intentionally ships with neutral content and media placeholders. Before deployment:

1. Replace the page title, description, contact details, copyright, and placeholder copy with approved project content.
2. Add the production canonical URL and environment-appropriate robots and sitemap configuration.
3. Add approved favicon, Open Graph image, and social metadata for the final brand.
4. Replace media placeholders with responsive `picture` or `img` content and meaningful alternative text where required.
5. Add an approved Contact form action and define submission, privacy, spam-protection, and error-handling requirements.
6. Add reviewed privacy and terms pages before exposing legal links.
7. Run cross-browser, accessibility, performance, and final content checks against the deployed environment.

The included Contact form has native browser validation but no submission backend.

## Component development

Keep reusable component styles in `src/scss/components`, section composition in `src/scss/sections`, and structural page layout in `src/scss/layout`. JavaScript behavior must use data attributes as hooks and preserve a usable no-JavaScript fallback.

Do not hardcode visual values in consuming styles. Reuse semantic tokens and shared Sass breakpoints documented in the project standards.

## Live demo

Landing page: https://landing-starter-kit.vercel.app

Component Playground: https://landing-starter-kit.vercel.app/playground.html

Native Select, date/time, range, and file-picker details vary by browser,
operating system, and mobile platform. The starter intentionally does not include
a custom validation layer, custom date/time pickers, file uploads, drag and drop,
or dark mode.
