# Landing Starter Kit

A reusable, accessible foundation for commercial landing pages. The starter combines semantic HTML, token-driven Sass, responsive sections, and small progressively enhanced JavaScript modules without a UI framework.

## Included

- Responsive Header and primary navigation
- Hero, Services, Benefits, Portfolio, Process, Reviews, FAQ, and Contact sections
- Reusable Button, Text, Section Heading, cards, Testimonial, Form, and Accordion components
- Shared containers, layout utilities, breakpoints, and semantic design tokens
- Keyboard-accessible navigation and Accordion behavior
- Sticky Header, anchor offsets, reduced-motion handling, and visible focus foundations

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

Preview the generated build locally with:

```bash
npm run preview
```

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
