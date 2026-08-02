# Release Checklist

Use this checklist before creating a Git tag or GitHub Release for the Landing Starter Kit. Complete conditional commercial-site checks only when the release is intended for a real deployment.

## 1. Versioning

- [ ] `package.json` version is correct.
- [ ] `package-lock.json` version is synchronized.
- [ ] Version follows Semantic Versioning.
- [ ] `CHANGELOG.md` contains the matching release version and date.
- [ ] `[Unreleased]` remains present for future changes.
- [ ] Release scope matches the intended version bump.

## 2. Git State

- [ ] Current branch is correct.
- [ ] Local branch is up to date with its remote.
- [ ] Working tree is clean.
- [ ] No temporary, debug, or generated files are staged.
- [ ] All release changes are committed.
- [ ] Commit history is understandable.

## 3. Build and Code Quality

- [ ] `npm install` or `npm ci` succeeds in a clean environment.
- [ ] `npm run build` passes.
- [ ] `git diff --check` passes before the final commit.
- [ ] No imports are broken.
- [ ] No design tokens are undefined.
- [ ] No component uses raw breakpoints or z-index values.
- [ ] No console errors occur during normal use.
- [ ] No JavaScript hooks are stale and initialization is not duplicated.

## 4. Responsive and Visual Review

- [ ] Review at 320px.
- [ ] Review at 375px.
- [ ] Review at 768px.
- [ ] Review at 1024px.
- [ ] Review at 1440px.
- [ ] Review at 1920px.
- [ ] No horizontal overflow occurs.
- [ ] Long text wraps safely.
- [ ] Sticky Header works.
- [ ] FAQ sticky CTA stays below the Header.
- [ ] Anchor links stop below the sticky Header.
- [ ] All sections retain their intended spacing and alignment.
- [ ] No unexpected layout shift occurs.

## 5. Accessibility

- [ ] Skip to content works.
- [ ] Keyboard navigation works with Tab and Shift+Tab.
- [ ] Mobile navigation works with the keyboard.
- [ ] Escape closes mobile navigation and restores focus.
- [ ] Accordion state and focus behavior work.
- [ ] Exactly one `h1` is present.
- [ ] Heading hierarchy is logical.
- [ ] Landmarks are correct.
- [ ] Form labels remain connected and visible in every floating-label state.
- [ ] Focus-visible indicators are clear.
- [ ] Reduced-motion preferences are respected.
- [ ] No ARIA references are broken.
- [ ] No IDs are duplicated.
- [ ] Contrast remains acceptable.

## 6. Content and Metadata

- [ ] Page title is correct.
- [ ] Meta description is correct.
- [ ] `lang` attribute matches the content.
- [ ] Contact details are correct.
- [ ] Placeholder copy and media are intentional.
- [ ] Legal links point to real pages or remain removed.
- [ ] Copyright year is current.
- [ ] Canonical URL is set when a production domain exists.
- [ ] Open Graph metadata is complete when publishing a real site.
- [ ] Favicon and social image are added when required.
- [ ] Robots and sitemap policy are configured for deployment.

## 7. Forms and Privacy

- [ ] Form uses POST.
- [ ] Real endpoint is configured before commercial deployment.
- [ ] Success and error behavior is defined.
- [ ] Spam protection is considered.
- [ ] Privacy and data-retention requirements are approved.
- [ ] No personal data appears in the URL.
- [ ] Legal consent text is added if required.

## 8. Documentation

- [ ] `README.md` is current.
- [ ] `ROADMAP.md` is current.
- [ ] `CHANGELOG.md` is current.
- [ ] `AI_RULES.md` is current.
- [ ] `ARCHITECTURE.md` is current.
- [ ] `COMPONENT_STANDARDS.md` is current.
- [ ] `DESIGN_TOKENS.md` is current.
- [ ] Documentation links resolve.
- [ ] Known limitations are documented.

## 9. Repository and Publication

- [ ] Repository name and package name are correct.
- [ ] Package remains private unless intentional npm publication is planned.
- [ ] `LICENSE` exists before open-source publication.
- [ ] `CONTRIBUTING.md` exists if external contributions are accepted.
- [ ] CI passes when CI is available.
- [ ] Release notes are prepared.
- [ ] Git tag uses the format `vX.Y.Z`.
- [ ] GitHub Release title and notes match the version.
- [ ] No secrets, tokens, local paths, or private data are committed.

## 10. Final Release Steps

- [ ] Final `npm run build` passes.
- [ ] `git status` is clean.
- [ ] Release commit is pushed.
- [ ] Annotated Git tag is created.
- [ ] Tag is pushed.
- [ ] GitHub Release is created.
- [ ] Published release is smoke-tested.
- [ ] Next `[Unreleased]` development cycle is ready.

## Release Sign-off

- **Version:**
- **Date:**
- **Reviewer:**
- **Final status:**
- **Notes:**
