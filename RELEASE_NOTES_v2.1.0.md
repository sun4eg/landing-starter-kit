# v2.1.0 — Modal Drawer

## Summary

v2.1.0 is a backward-compatible minor release adding blocking side-sheet presentations to the existing Modal component.

## Added

- `.modal--drawer` presents a Modal at logical inline-end.
- `.modal--drawer-start`, used with `.modal--drawer`, changes placement to logical inline-start.
- The Component Playground includes realistic task and filtering examples, usage guidance, and public API documentation.

## Architecture

Drawer reuses the existing Modal markup, `.modal__dialog` structure, `data-modal-*` hooks, JavaScript lifecycle, and accessibility semantics. The centered Modal remains the default. No standalone Drawer controller, runtime dependency, public width API, or Drawer-specific animation was added.

## Accessibility and interaction

- Existing dialog semantics, accessible naming, focus containment and restoration, Escape handling, inert isolation, page scroll locking, Navigation handoff, Toast isolation, and one-active-dialog policy are retained.
- Existing viewport bounds and scrolling keep the close control, content, and footer actions reachable in narrow and unusually short layouts.
- Logical placement reverses correctly in right-to-left contexts.
- Drawer inherits the existing Modal reduced-motion and forced-colors behavior.

## Validation

- Production build emits both landing and Playground HTML entry points.
- Installed-Chrome regression suite: 59 tests passed.
- Managed CI configuration: 59 Chromium, 54 Firefox, and 54 WebKit tests (167 total across 8 files).
- The repository owner reports that the Chromium, Firefox, and WebKit CI matrix passed on the committed Drawer implementation.
- Targeted visual and responsive acceptance was completed for the centered Modal regression boundary and Drawer end/start placement, with no overflow blocker observed in the accepted scenarios.

This focused evidence is not universal browser, device, or assistive-technology certification.

## Compatibility and upgrade

Projects using v2.0.3 can upgrade directly without markup or JavaScript migration. Existing Modal usage remains valid; Drawer presentation is opt-in through the new modifiers.
