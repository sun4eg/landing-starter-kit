# Landing Starter Kit v2.0.0-beta.1

## 1. Summary

This beta is suitable for evaluation and integration testing. It advances the v2 component system from the alpha foundation to a substantially formed component library with reconciled architecture, documented public APIs, and verified core browser interactions.

It is not the stable v2.0.0 release. Cross-browser, physical-device, forced-colors, and assistive-technology validation is still recommended, and APIs should not be assumed final until stable release decisions are complete.

## 2. What Changed Since v2.0.0-alpha.1

- Expanded the reusable production component set and its living Playground documentation.
- Remediated Modal and mobile Navigation isolation and ownership issues.
- Prevented Playground demonstration forms from submitting or exposing entered values in URLs while preserving native validation.
- Migrated production component colors to the documented semantic-token hierarchy.
- Added Testimonial documentation and synchronized the README component inventory.
- Added progressive `100dvh` viewport bounds while preserving the `100vh` fallback.
- Corrected post-remediation focus-ring visibility and token-compliance regressions.
- Removed Service Card's ambiguous percentage height; parent Grid stretching continues to provide intentional equal-height rows, and targeted manual Safari verification confirmed the reproduced Playground Card no longer stretches.

## 3. Component Coverage

- Foundations and layout: design tokens, responsive typography, containers, layout utilities, Header, Primary Navigation, Footer, Text, and Section Heading.
- Actions and navigation: Button, Accordion, Tabs, Breadcrumbs, and Pagination.
- Forms and controls: Form, Checkbox, Radio, Switch, Select, Password Input, Number Stepper, Range Slider, Date Picker, Time Picker, DateTime Local, and File Input.
- Feedback and states: Badge, Alert, Divider, Progress, Spinner, Skeleton, Empty State, and Toast.
- Overlay: Modal.
- Marketing and content: Service Card, Project Card, Pricing Card, Stats, Timeline, Logo Cloud, CTA Banner, and Testimonial.

The landing page continues to provide Hero, Services, Benefits, Portfolio, Process, Reviews, FAQ, and Contact section compositions.

## 4. Architecture and Design-Token Improvements

Production components now consume purpose-led semantic color roles instead of direct numeric palette primitives. Primitive palette definitions remain centralized as foundations, while interaction, action, current-state, brand, inverse, overlay, and status responsibilities remain distinct.

Modal and Toast share centralized progressive viewport geometry: older browsers retain `100vh`, while supporting browsers use `100dvh`. No component API or JavaScript viewport workaround was introduced.

## 5. Accessibility and Interaction Improvements

- Modal isolates external page content and Toast controls, traps keyboard focus, guards scripted focus, locks page scrolling, and restores prior inert and focus state.
- Full-screen mobile Navigation contains focus, isolates background branches, locks page scrolling, and coordinates ownership with Modal and Toast.
- Playground forms retain browser-native constraint validation without reloads, query-string exposure, or history pollution.
- Focus-ring visibility was restored after automated visual regression testing identified insufficient contrast.
- Reduced-motion behavior remains available for animated components and global transitions.

These improvements have source-level and automated Chrome coverage; they do not constitute assistive-technology certification.

## 6. Playground and Documentation Improvements

The multi-page build continues to emit the landing page and Component Playground. The Playground now documents the expanded production inventory, component APIs, states, responsive examples, accessibility guidance, semantic tokens, and Testimonial composition and resilience.

The README inventory matches the shipped production and Playground components.

## 7. QA Completed

- [x] Production build with both HTML entry points.
- [x] JavaScript syntax validation.
- [x] Structural checks for duplicate IDs, local fragments, and ARIA references.
- [x] Source-level accessibility, responsive, semantic-token, and robustness reconciliation.
- [x] Automated Google Chrome headless checks covering core keyboard and pointer interactions, focus containment, Modal and Navigation coordination, Playground form interception, responsive overflow, reduced motion, and targeted post-visual regression checks.

Chrome automation is narrower than a complete human browser and device pass.

## 8. Manual Checks Still Recommended

- Firefox and Safari desktop rendering and interaction.
- iOS Safari and Android Chrome viewport, touch, native-control, and mobile Navigation behavior.
- VoiceOver on macOS and iOS, plus NVDA on Windows.
- Windows forced-colors and operating-system high-contrast modes.
- Human visual review at 200% and 400% zoom where practical.
- Deployed Vercel routing and asset behavior.

## 9. Known Limitations

- A complete automated interaction regression suite is not yet included.
- VoiceOver, NVDA, forced-colors, and high-contrast compatibility have not been fully verified.
- Native Select, date/time, and file interfaces vary across browsers, operating systems, and mobile platforms.
- Button and Spinner size-modifier naming consistency remains a possible post-beta API-cleanup topic.
- The Contact form has no submission backend; adopters must supply approved submission, privacy, spam-protection, and error-handling behavior.
- File upload workflows, drag and drop, previews, and upload progress are not included.
- Dark mode is not included.

## 10. Evaluation Guidance

Use this beta to evaluate component composition, documented APIs, responsive behavior, native Form Controls, and integration into representative landing pages. Test with realistic localized content and the browsers, devices, input methods, and assistive technologies required by the intended deployment.

Treat platform-specific differences in native controls as expected unless they cause functional failure, inaccessible state, clipping, or page-level overflow.

## 11. Release Checklist

- [x] Automated Chrome production-build smoke and targeted interaction checks.
- [x] Landing page automated smoke.
- [x] Playground automated smoke.
- [x] Modal + actionable Toast automated regression check.
- [x] Mobile Navigation automated regression check.
- [x] Playground Form and Form Controls automated smoke.
- [x] Tabs automated keyboard smoke.
- [x] Reduced-motion automated smoke.
- [x] Targeted Safari verification of the reproduced Service Card composition regression.
- [ ] Chrome desktop manual smoke.
- [ ] Firefox desktop smoke.
- [ ] Safari desktop smoke.
- [ ] iOS Safari.
- [ ] Android Chrome.
- [ ] Keyboard-only manual pass.
- [ ] Touch pass.
- [ ] 200% zoom.
- [ ] 400% zoom where practical.
- [ ] Forced colors/high contrast.
- [ ] VoiceOver macOS.
- [ ] VoiceOver iOS.
- [ ] NVDA.
- [ ] Vercel deployment and routing check.
- [ ] Landing page manual visual review.
- [ ] Component Playground manual visual review.
- [ ] Modal + Toast manual interaction review.
- [ ] Mobile Navigation manual interaction review.
- [ ] Forms and complete Form Controls manual review.
- [ ] Tabs manual interaction review.
- [ ] Native date, time, DateTime Local, and file-control platform review.
