# Component Standards

This document defines the quality standard for every UI component in the Landing Starter Kit.

## Component Philosophy

Every component must be:

- Reusable across different pages and contexts.
- Independent from unrelated components and project-specific behavior.
- Accessible to keyboard, pointer, and assistive-technology users.
- Predictable in its structure, states, and behavior.
- Easy to extend without rewriting its foundation.
- Free of project-specific content, branding, and decorative styles.

Components should solve general interface problems while remaining clear, focused, and adaptable.

## Component Architecture

Every component must have:

- One clearly defined responsibility.
- One dedicated SCSS file.
- One documented public API.
- No hidden dependencies.

Do not couple components together. A component may use shared design tokens and utilities, but it must not rely on another component's internal selectors, markup, or implementation details.

## Naming Convention

Use BEM for component classes:

```text
.button
.button--primary
.button--secondary
.button--outline
.button--ghost

.button__icon
.button__label
```

Use blocks for components, elements for meaningful component parts, and modifiers for variants or configurations. Do not encode DOM structure into class names.

Do not use deep selector nesting. The maximum nesting level is 2.

## Design Tokens

Never hardcode:

- Colors.
- Spacing.
- Typography.
- Border radii.
- Shadows.
- Transitions.
- Z-index values.
- Component sizes.

Always use existing design tokens. If a required reusable value does not exist, add an appropriately named token to the established token system before using it.

## Accessibility

Every interactive component must support:

- Keyboard navigation.
- Visible `focus-visible` states.
- Reduced-motion preferences.
- Semantic HTML.
- ARIA only when necessary.

Components with custom-rendered controls, selected states, or essential visual
boundaries must also remain perceivable in forced-colors mode. Prefer native
semantics, system colors, visible geometry, and explicit focus outlines; never
disable system color adaptation across an entire component.

Prefer native HTML semantics and behavior. Never remove browser accessibility without providing a complete and tested replacement.

Interactive components must keep accessible names, native or ARIA states,
control relationships, visibility, and focus ownership synchronized through
every enhanced state. Use live regions only for genuinely dynamic updates and
avoid nesting competing announcement roles. Automated DOM assertions protect
these contracts but do not replace manual VoiceOver or NVDA verification.

## Responsive Design

Components must work on:

- Mobile.
- Tablet.
- Desktop.

Use fluid and intrinsic layouts wherever possible. Do not use fixed widths unless the component explicitly requires one and the constraint remains usable across supported viewports.

## Public API

Every component must expose a predictable and documented API. Documentation must identify:

- Base class.
- Modifiers.
- States.
- Optional elements.

Example:

```text
Base:
.button

Variants:
.button--primary
.button--secondary

Sizes:
.button--sm
.button--md
.button--lg

States:
disabled
focus-visible
active
```

The public API must remain separate from internal implementation details.

## Performance

Avoid:

- Unnecessary nesting.
- Duplicated selectors.
- Duplicated declarations.
- Unnecessary specificity.

Prefer CSS custom properties over repeated declarations, particularly when implementing variants, states, and sizes.

## Definition of Done

A component is complete only if:

- ✓ Uses design tokens only.
- ✓ Is accessible.
- ✓ Is responsive.
- ✓ Is reusable.
- ✓ Has a documented API.
- ✓ Passes `npm run build`.
- ✓ Is reviewed before commit.

## Review Checklist

Before every commit, verify:

- Architecture.
- Accessibility.
- Responsiveness.
- Naming.
- Consistency.
- Public API.
- Build status.

## AI Instructions

When implementing a component:

1. Read `AI_RULES.md`.
2. Read `COMPONENT_STANDARDS.md`.
3. Follow the existing project architecture.
4. Never change unrelated files.
5. Run `npm run build`.
6. Explain all changed files.
7. Never create Git commits.
