# Design Tokens

## Purpose

Design tokens are the single source of truth for the project's visual decisions. They give recurring decisions stable names so themes, components, and layouts can evolve without spreading raw values throughout the codebase.

Reusable components should consume tokens that describe intent rather than implementation. A semantic token such as `--color-background` communicates why a value is used; a raw color value communicates only what it currently looks like. This separation makes changes safer, keeps components theme-neutral, and prevents unrelated components from becoming coupled to a specific palette or scale value.

The token system is defined centrally and consumed through CSS custom properties. Sass modules continue to own architecture and shared breakpoints, while CSS custom properties provide runtime inheritance, contextual overrides, and future theming support.

---

## Token Hierarchy

The system follows three levels. Dependencies should flow downward: component tokens reference semantic tokens, and semantic tokens reference primitive tokens.

### 1. Primitive Tokens

Primitive tokens represent foundational design values without assigning them a UI purpose. Typical groups include:

- raw colors;
- spacing scale;
- typography scale;
- radius scale;
- shadows;
- z-index levels;
- durations;
- easing curves.

Primitive names describe a scale or value family. They make the raw design language consistent, but they do not explain how a value should be used.

Reusable components must not consume primitive tokens directly. Instead, a semantic or component token should translate the primitive value into an explicit responsibility. This keeps a future palette, density, or typography change from leaking implementation assumptions into component code.

### 2. Semantic Tokens

Semantic tokens describe purpose rather than appearance. They form the shared contract used by layouts and reusable components.

Common semantic groups include:

- **Layout:** header height, sticky top, container width, and content measure.
- **Surface:** page background, elevated or neutral surfaces, and borders.
- **Text:** primary, secondary, and inverse text.
- **Interaction:** focus indicators, links, and disabled states.
- **Controls:** control heights, internal padding, and icon sizes.

Semantic tokens normally reference primitive tokens. Components should consume semantic tokens whenever a shared purpose already exists. A new semantic token is appropriate when the same visual responsibility can reasonably apply across multiple components, layouts, or themes.

### 3. Component Tokens

A reusable component may expose local custom properties for concepts that belong specifically to that component. Component tokens are useful for variants, states, and contextual customization without duplicating complete declaration sets.

For example, a Button component might define:

```css
.button {
  --button-background: var(--color-link);
  --button-color: var(--color-text-inverse);
}
```

Component tokens should normally reference semantic tokens. Modifiers may remap those local properties while the component's structural rules continue consuming the same stable API. Do not introduce a component token when it merely renames a semantic token without enabling meaningful component-level variation.

## Rules

- Never hardcode visual values in base, layout, component, or section styles.
- Prefer an existing semantic token before introducing another concept.
- Add a semantic token only when it represents a reusable purpose.
- Keep dependencies directional: component → semantic → primitive.
- Do not consume primitive tokens directly inside reusable components.
- Do not create component tokens that unnecessarily duplicate semantic tokens.
- Keep token definitions centralized and avoid local competing scales.
- Treat token renaming or removal as an API change and review all consumers.
- Preserve sensible fallbacks and contrast when tokens are overridden by themes.

## Naming

Token names describe responsibility, not their current rendered value. Use predictable lowercase names separated with hyphens, and group related concepts with a stable prefix when that improves discovery.

Good names include:

- `--color-background`
- `--sticky-top`
- `--header-height`

Avoid names such as:

- `--blue-background`
- `--spacing-18`
- `--large-header`

Appearance-based names become misleading when a theme changes. Arbitrary numeric names hide purpose. Relative words such as “large” are acceptable for primitive scales, but semantic names should state what the value controls.

## Sticky System

The shared sticky system coordinates the Header with sticky content:

- `--header-height` represents the visual height occupied by the sticky Header.
- `--sticky-offset` represents the additional breathing room required below it.
- `--sticky-top` combines both values into the final viewport position.

```css
--sticky-top: calc(var(--header-height) + var(--sticky-offset));
```

Future sticky sidebars, tables of contents, floating calls to action, filters, and cards should consume the shared result directly:

```css
top: var(--sticky-top);
```

Components must not repeat the Header-plus-spacing calculation locally. If the Header height or shared spacing changes, every sticky consumer should update through the token system automatically.

## Responsive Design

Responsive behavior should use the shared Sass breakpoints and reusable layout tokens. Breakpoints describe system-wide layout transitions; tokens describe fluid dimensions, measures, spacing, and control sizes within those transitions.

Avoid component-specific breakpoint values and isolated responsive dimensions. When a value must vary responsively, override a semantic or component token at an established breakpoint so the component declarations remain stable. Prefer intrinsic layout, fluid sizing, and content-driven wrapping over adding more breakpoints.

## Accessibility

Tokens encode accessibility decisions as well as visual style. The system supports:

- consistent, visible focus rings and offsets;
- readable content measures and line lengths;
- spacing and control sizes that preserve usable touch targets;
- motion durations that can be neutralized for reduced-motion preferences;
- semantic foreground and background colors that can be reviewed as contrast pairs.

A token does not guarantee accessibility by itself. Any new value or theme mapping must be checked in its real foreground, background, state, and interaction context. Semantic relationships should remain valid when users zoom text, increase contrast, reduce motion, or use forced-color modes.

## Future Evolution

The token system should evolve by adding purpose-driven layers rather than parallel value collections. Likely extensions include:

- light and dark themes that remap semantic color tokens;
- client or brand themes that replace primitives while preserving semantic contracts;
- component themes that remap a small, documented component-token API;
- density modes that adjust control and spacing semantics consistently;
- additional accessibility modes for contrast or motion preferences.

Introduce changes incrementally. First identify a repeated responsibility, then define or reuse a semantic token, migrate consumers, validate the affected themes and states, and finally remove obsolete aliases. Avoid speculative tokens without a demonstrated consumer. Stable semantic names should outlive individual brand palettes and visual trends.

## Best Practices

### Do

- Reuse semantic tokens before adding new ones.
- Keep names meaningful and responsibility-driven.
- Build small reusable abstractions from established token relationships.
- Map component variants through local component tokens when this reduces duplication.
- Review responsive, interactive, and accessible states after changing token values.

### Don't

- Hardcode visual values in consuming styles.
- Duplicate an existing concept under a new name.
- Create one-off tokens for a single declaration with no reusable meaning.
- Bind semantic tokens to a particular color name or brand.
- Allow component tokens to become a second, disconnected design system.
