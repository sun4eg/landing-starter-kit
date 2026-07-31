# Project Vision

This repository is a reusable Landing Starter Kit for building multiple commercial landing pages from a stable technical foundation. It is not tied to one brand, industry, campaign, or visual direction. Its purpose is to reduce repeated setup work while preserving the flexibility required by different products and clients.

The architecture is designed to be:

- **Reusable:** foundations and components can serve many landing pages.
- **Scalable:** new components and sections can be introduced without reorganizing the project.
- **Maintainable:** responsibilities are explicit, styles are centralized appropriately, and public APIs are predictable.
- **Accessible:** semantic structure, keyboard support, focus handling, and motion preferences are default requirements.
- **Framework-independent:** the browser platform remains the primary runtime, avoiding unnecessary coupling to a UI framework.
- **AI-friendly:** written rules, small tasks, clear boundaries, and repeatable verification make AI-assisted changes easier to review.

# Core Principles

- **Composition over duplication:** pages are assembled from small foundations, utilities, components, and sections instead of copying implementations.
- **Design tokens first:** shared visual decisions are expressed as tokens before they are consumed by styles.
- **Semantic HTML:** markup communicates document meaning independently of presentation and scripts.
- **Accessibility by default:** accessibility is part of implementation, not a separate repair phase.
- **Reusable components:** components solve general interface problems and avoid project-specific assumptions.
- **Low CSS specificity:** shallow BEM selectors keep overrides understandable and prevent specificity conflicts.
- **Modular JavaScript:** behavior is divided into focused ES Modules with explicit dependencies.
- **Predictable APIs:** classes, modifiers, elements, and states follow documented conventions.

# Directory Structure

The `src/` directory contains all source assets that participate in application development and the Vite build.

## SCSS

`src/scss/` is the styling entry point and coordination layer. Its `main.scss` file loads the style system in a deliberate order through Sass modules.

- `abstracts/` contains design tokens, functions, and mixins. It defines shared decisions and tools but does not own page-level presentation.
- `base/` establishes browser normalization, typography, global document behavior, fonts, accessibility foundations, and other element-level defaults.
- `layout/` controls spatial composition: containers, section rhythm, document regions, grids, and reusable layout utilities.
- `components/` contains independent UI building blocks. Each component owns one SCSS file and exposes a documented BEM API.
- `sections/` contains compositions that represent recognizable landing-page regions. Sections may compose layouts and components but must not redefine their internal APIs.

This separation prevents global foundations, reusable controls, and page-level compositions from becoming entangled.

## JavaScript

`src/js/` is reserved for application behavior written as ES Modules.

- `modules/` contains feature-level behavior such as navigation, disclosures, dialogs, or form interactions. Each module should initialize safely and remain independent.
- `utils/` contains small, reusable helpers without feature-specific assumptions. Utilities support modules but do not control page behavior themselves.

Keeping utilities separate from features makes dependencies visible and discourages shared global state.

## Assets

- `src/images/` contains raster and content imagery processed by the build pipeline.
- `src/icons/` contains reusable interface icons and related source assets.
- `src/fonts/` contains locally hosted font files when a project requires them.

These asset types are separated because they have different optimization, loading, accessibility, and maintenance requirements.

# Styling Architecture

Sass uses `@use` because it provides explicit module boundaries, avoids uncontrolled global scope, and makes dependencies easier to understand than legacy `@import`. The main entry point determines stylesheet order while each partial remains responsible for one architectural layer.

CSS Custom Properties hold design tokens because they remain available at runtime. They support inheritance, contextual overrides, responsive adaptation, theming, and browser inspection without recompiling Sass.

Component-local custom properties are preferred for variants and states. A component can map global tokens to local concepts such as background, border, or control height once, then modifiers only change those local mappings. This reduces duplicated declarations and keeps the public API stable.

Components never hardcode colors or spacing because isolated values weaken consistency and make redesigns expensive. Visual decisions belong in the token system, where they can be reviewed, reused, and updated centrally.

# HTML Architecture

Semantic HTML provides meaningful landmarks and relationships before CSS or JavaScript loads. Native elements are preferred because they carry established keyboard behavior and accessibility semantics.

The document outline uses one page-level heading followed by logically ordered section headings. Sections receive accessible names through their headings, while `header`, `main`, `section`, `nav`, and `footer` landmarks communicate page structure to assistive technologies and search engines.

A skip link gives keyboard and screen-reader users a direct path to the main content. This is part of the base document experience rather than an optional enhancement.

Progressive enhancement keeps essential content and navigation usable without JavaScript. Scripts add behavior to a valid HTML foundation instead of generating or replacing the entire document.

The same semantic structure is SEO-friendly: meaningful headings, crawlable content, stable landmarks, and server-delivered HTML give search engines a reliable representation of each page.

# JavaScript Architecture

JavaScript uses ES Modules so dependencies are explicit, code can be loaded and optimized by Vite, and features do not leak implementation details into global scope.

Modules remain small and independent. Each feature owns its DOM queries, event handling, state, and cleanup strategy. It must fail safely when its expected markup is absent.

Global variables are prohibited because they create hidden coupling, naming conflicts, and unpredictable initialization order. Shared behavior must flow through explicit imports, exports, and function parameters.

General-purpose utilities live separately from feature modules. This keeps helpers reusable while preventing utility files from accumulating application state or controlling unrelated features.

No JavaScript framework is required. Native browser APIs are sufficient for the intended landing-page interactions and keep the starter lightweight, portable, and easy to embed in different delivery environments.

# Component Model

Every component follows [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md) and moves through the same lifecycle:

```text
Specification
      ↓
Implementation
      ↓
Review
      ↓
Refactor
      ↓
Build
      ↓
Commit
```

The specification defines responsibility, semantic markup, variants, states, and public API before styling begins. Implementation then uses established tokens and architecture. Review checks accessibility, responsiveness, naming, API clarity, and unwanted coupling. Refactoring resolves issues found during review. A successful production build verifies integration before a human creates the commit.

# Development Workflow

Development follows a deliberate, reviewable sequence:

```text
Roadmap
   ↓
Small task
   ↓
AI implementation
   ↓
Human review
   ↓
Refinement
   ↓
Build
   ↓
Commit
   ↓
Push
```

The roadmap provides direction without turning a large milestone into one risky change. Each task should be small enough to understand and verify independently. AI may implement the requested scope, but human review remains the authority for architectural and product decisions. Refinement happens before the build and commit so repository history contains reviewed, working increments.

# AI Collaboration

AI assistants working in this repository must:

1. Read [AI_RULES.md](./AI_RULES.md).
2. Read [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md) before implementing or changing a component.
3. Modify only the files required by the current request.
4. Never change the architecture without an explicit request.
5. Explain every changed, created, or deleted file.
6. Run `npm run build` before reporting completion.
7. Never create Git commits or push changes.

This workflow makes generated changes transparent, bounded, and easy for a human to evaluate.

# Future Evolution

The repository can evolve into a complete UI Kit by adding reviewed components with stable BEM APIs. As token coverage, usage guidance, accessibility patterns, and component documentation mature, the same foundation can become a broader design system.

Landing-page sections can then compose those components into multiple templates for different commercial use cases. Brand-specific tokens, content, imagery, and section combinations can vary without changing the core architecture. Over time, the repository can serve as a reusable commercial starter while retaining the same separation between foundations, layouts, components, sections, behavior, and assets.

# Architectural Decisions

Current architectural decisions:

- ✓ Vite
- ✓ Sass `@use`
- ✓ CSS Custom Properties
- ✓ BEM
- ✓ ES Modules
- ✓ Design Tokens
- ✓ Component-first development
- ✓ Accessibility-first implementation
- ✓ AI-assisted workflow
- ✓ Manual code review before every commit
