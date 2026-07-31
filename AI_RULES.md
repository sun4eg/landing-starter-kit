# AI Development Rules

These rules apply to all AI assistants working on this project.

## 1. General Principles

- Preserve the existing project architecture unless a requested change clearly requires an architectural adjustment.
- Do not modify the Vite configuration.
- Do not modify `package.json` unless the user explicitly requests it.
- Do not run `git commit` or `git push`.
- Make only changes that are necessary for the current task.
- Do not delete or overwrite existing work unless the user explicitly requests it.

## 2. SCSS

- Use the existing design tokens for all visual values.
- Do not hardcode colors, dimensions, spacing, border radii, or shadows outside the design-token definitions.
- Add a reusable token before using a new visual value when no suitable token exists.
- Preserve the Sass module architecture and connect styles through `@use`.
- Follow the existing `abstracts`, `base`, `layout`, `components`, and `sections` structure.
- Place styles in the file and layer that match their responsibility.
- Do not introduce CSS frameworks or parallel styling systems.

## 3. HTML

- Use semantic HTML elements that describe the purpose and structure of the content.
- Treat accessibility as a requirement, including keyboard access, visible focus states, meaningful labels, and appropriate alternative text.
- Maintain a logical heading hierarchy without skipping levels for visual reasons.
- Prefer native HTML behavior before adding ARIA attributes or JavaScript.
- Use ARIA only when native HTML cannot provide the required semantics.

## 4. JavaScript

- Use ES Modules with explicit imports and exports.
- Do not create global variables or attach application state to `window`.
- Keep modules small, independent, and focused on one responsibility.
- Keep DOM queries and event handling scoped to the relevant module.
- Ensure that modules fail safely when their target elements are not present.
- Avoid adding dependencies when the required behavior can be implemented clearly with native JavaScript.

## 5. Before Completing Any Task

- Run `npm run build`.
- Confirm that the project builds without errors.
- Fix any build errors caused by the changes before reporting completion.
- List every file changed, created, or deleted during the task.
- Briefly explain the changes and their purpose.

## 6. Implementation Workflow

Each implementation should normally be completed in a single task.

The AI assistant must:

1. Read the relevant project documentation and existing implementation.
2. Define a small and predictable public API before writing code.
3. Implement the requested component or feature.
4. Perform a self-review of its own changes.
5. Fix any Critical, Major, or clear Minor issues found during the self-review.
6. Run `npm run build` and resolve all build errors.
7. Verify that unrelated files were not modified.
8. Report:
   - the final public API;
   - every changed, created, or deleted file;
   - validation results;
   - any intentional limitations or deferred improvements.

Additional human review is optional and should be requested only when:

- the component is architecturally complex;
- JavaScript behavior or state management is involved;
- accessibility is non-trivial;
- the implementation changes shared APIs or design tokens;
- the resulting code appears inconsistent or unclear.

The AI assistant must never run `git commit` or `git push`.
Commits are performed only by the project owner.