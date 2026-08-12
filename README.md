# Landing Starter Kit

An AI-ready foundation for modern, accessible, responsive landing pages, built with Vite, token-driven Sass, BEM, semantic HTML, and vanilla JavaScript ES Modules—without a UI framework.

[![Version 2.0.0-beta.1](https://img.shields.io/badge/version-2.0.0--beta.1-0A7EA4)](./CHANGELOG.md) [![MIT License](https://img.shields.io/badge/license-MIT-green)](./LICENSE) [![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vite.dev/) [![Sass](https://img.shields.io/badge/Sass-1.102-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/) [![JavaScript ES Modules](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) [![Accessibility](https://img.shields.io/badge/Accessibility-A11y-005A9C)](https://www.w3.org/WAI/) [![AI Ready](https://img.shields.io/badge/AI-Ready-8A2BE2)](./AI_RULES.md)

> `v2.0.0-beta.1` is an evaluation and integration-testing release. Manual cross-browser,
> mobile-platform, forced-colors, and assistive-technology verification remains
> recommended before production adoption.

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
