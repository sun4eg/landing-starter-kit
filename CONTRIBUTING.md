# Contributing

Contributions should preserve the Landing Starter Kit's architecture, accessibility standards, and reusable, theme-neutral foundation. Keep changes focused, reviewable, and useful across commercial landing-page contexts.

## 1. Before You Start

- Read the project documentation before changing code.
- Confirm that the proposed work fits the current architecture and roadmap.
- Prefer focused changes over broad refactors.
- Avoid dependencies without clear, documented justification.
- Do not modify Vite or package configuration unless the work explicitly requires it.
- Discuss changes to public APIs, architecture, or design tokens before implementation.

Start with the [README](./README.md), [architecture](./ARCHITECTURE.md), [component standards](./COMPONENT_STANDARDS.md), and [design-token guidance](./DESIGN_TOKENS.md).

## 2. Development Setup

Use the Node.js version documented in [README.md](./README.md), then run:

```bash
npm install
npm run dev
npm run build
```

The project uses Vite, Sass, semantic HTML, BEM, and native ES Modules. No frontend framework is required.

## 3. Contribution Workflow

1. Create a focused branch.
2. Read the relevant documentation.
3. Define or confirm the public API.
4. Implement the smallest justified change.
5. Perform a self-review.
6. Fix all Critical, Major, and clear Minor findings.
7. Run `npm run build`.
8. Perform manual visual and accessibility checks when appropriate.
9. Update documentation and `CHANGELOG.md` when required.
10. Create a clear commit and Pull Request.

AI assistants must never commit or push unless explicitly instructed by the project owner.

## 4. Architecture Rules

- `abstracts` contains shared Sass foundations, breakpoints, and tokens.
- `base` contains reset, typography, and global document foundations.
- `layout` contains shared page structure and composition utilities.
- `components` contains independent, reusable UI blocks.
- `sections` composes components and layouts into landing-page regions.
- JavaScript modules remain focused, independent, and progressively enhanced.

Do not create parallel styling systems, place component styles in unrelated layers, extract abstractions before reuse is demonstrated, or introduce circular dependencies. See [ARCHITECTURE.md](./ARCHITECTURE.md).

## 5. CSS and Design Tokens

- Reuse existing design tokens.
- Do not hardcode visual values outside token definitions.
- Make reusable components consume semantic tokens whenever possible.
- Make component-local custom properties reference shared tokens.
- Use shared Sass breakpoint variables.
- Keep selectors shallow and specificity low.

Follow [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) and [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md).

## 6. HTML and Accessibility

- Start with semantic HTML.
- Use exactly one `h1` per page and maintain a logical heading hierarchy.
- Use buttons for actions and links for navigation.
- Connect every form label with its control.
- Prefer native behavior before adding ARIA.
- Preserve visible keyboard focus and logical focus order.
- Use progressive enhancement so essential content remains available without JavaScript.
- Write meaningful labels, button text, and link text.

Manually check Tab and Shift+Tab order, Enter and Space activation, Escape where supported, mobile navigation, Accordion behavior, Skip to content, and every floating-label state.

## 7. JavaScript

- Use ES Modules with named imports and exports.
- Do not create globals or attach application state to `window`.
- Use data attributes as behavior hooks, not styling classes.
- Fail safely when optional targets or valid markup are absent.
- Keep initialization idempotent.
- Support multiple instances where appropriate.
- Use efficient listeners; throttle high-frequency events and avoid unnecessary global handlers.

## 8. Component Changes

Document each component's:

- public BEM API;
- modifiers and runtime states;
- accessibility behavior;
- responsive behavior;
- intentional limitations;
- sensible future extension points.

Do not add unused modifiers, fake interactive containers, or JavaScript coupled to BEM styling classes.

## 9. Validation Before Pull Request

- [ ] `npm run build` passes.
- [ ] `git diff --check` passes.
- [ ] No unrelated files changed.
- [ ] No raw visual values were added.
- [ ] No raw breakpoints or z-index values were added.
- [ ] No imports are broken.
- [ ] No IDs are duplicated.
- [ ] No fragment or ARIA references are broken.
- [ ] Responsive layouts were reviewed.
- [ ] Keyboard interaction was reviewed.
- [ ] Long-content resilience was reviewed.
- [ ] Documentation was updated where required.
- [ ] `CHANGELOG.md` was updated for user-facing changes.

## 10. Commit and Pull Request Guidance

Use clear commits. Conventional Commit prefixes are recommended:

- `feat:` new user-facing capability;
- `fix:` objective defect correction;
- `refactor:` behavior-preserving architecture improvement;
- `docs:` documentation-only change;
- `chore:` maintenance work;
- `test:` test coverage or test infrastructure.

Pull Requests should explain:

- what changed and why;
- public API impact;
- accessibility impact;
- responsive impact;
- validation performed;
- screenshots when visual changes are involved;
- known limitations.

## 11. AI-Assisted Contributions

AI-assisted development is welcome, but [AI_RULES.md](./AI_RULES.md) is authoritative. Review all generated code. Self-review does not replace human review for complex architecture, behavior, accessibility, or public API changes. Never commit prompts, private information, or generated work that has not been checked against the same architecture and accessibility standards as human-written code.

## 12. Security and Privacy

- Never commit secrets, credentials, private keys, personal data, or local filesystem paths.
- Require privacy review for form or data-handling changes.
- Justify and review dependency additions.
- Report sensitive vulnerabilities privately to a project maintainer; do not publish exploit details in a public issue.

## 13. Release Process

Releases follow Semantic Versioning and are documented in [CHANGELOG.md](./CHANGELOG.md). Before release, complete [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) and keep the package version, changelog entry, Git tag, and release notes synchronized.
