# Landing Starter Kit v2.0.0-alpha.1

## Summary

This alpha introduces a production component foundation, a complete native Form
Controls system, and a living multi-page Component Playground. It also refines
responsive Header navigation and documents accessibility-focused native behavior,
public APIs, responsive states, and design-token usage.

This release is intended for evaluation and integration testing. The repository
is not published as a package with established external consumers, so no consumer
migration steps are required.

## Highlights

- Foundation: design tokens, responsive typography, Text, Section Heading,
  containers, layout utilities, focus foundations, and reduced-motion handling.
- Production components: Button, Service Card, Project Card, Testimonial,
  Accordion, Form, Header, Primary Navigation, and Footer.
- Form Controls: Checkbox, Radio, Switch, Select, Password Input, Number Stepper,
  Range Slider, Date Picker, Time Picker, DateTime Local, and File Input.
- Component Playground: multi-page Vite output, living API documentation,
  responsive examples, design-token references, desktop documentation panel,
  production-style mobile navigation, and synchronized current-section tracking.
- Navigation: full-viewport mobile panels below the sticky Header, accessible
  toggle state, Escape handling, focus restoration, and native fragment links.

## Accessibility

- Native inputs remain the source of truth for values, validation, keyboard
  behavior, touch interaction, and form submission.
- Visible labels, scoped descriptions, valid ARIA relationships, and meaningful
  button names are documented throughout the Playground.
- Focus handling, reduced-motion preferences, responsive reflow, native radio and
  range keyboard behavior, and navigation focus restoration are preserved.
- Browser- and platform-owned Select, date/time, and file-picker interfaces remain
  native rather than being replaced with custom widgets.

## Known Alpha Limitations

- Final manual Safari and Firefox verification remains outstanding.
- VoiceOver and NVDA verification remains outstanding.
- Forced-colors and operating-system high-contrast verification remains
  outstanding.
- Native picker presentation and behavior vary across browsers, operating systems,
  and mobile platforms.
- No custom validation layer is included; examples preserve native validation.
- File drag and drop, previews, uploads, and upload progress are not included.
- Dark mode is not included.

## Manual Release Checklist

- [ ] Chrome desktop smoke test.
- [ ] Playground desktop documentation navigation.
- [ ] Playground mobile navigation at supported responsive widths.
- [ ] Keyboard-only navigation and visible-focus review.
- [ ] Checkbox, Radio, Switch, Select, Password Input, Number Stepper, Range Slider,
      Date Picker, Time Picker, DateTime Local, and File Input interactions.
- [ ] Native validation examples.
- [ ] File selection and clearing.
- [ ] Native date and time picker opening.
- [ ] Responsive widths and 200% zoom.
- [ ] Reduced-motion behavior.
- [ ] Vercel deployment output and routing.
