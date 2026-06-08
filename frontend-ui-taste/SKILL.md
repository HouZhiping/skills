---
name: frontend-ui-taste
description: Improve frontend UI design quality and visual taste for web apps, dashboards, admin systems, Vue/React pages, CSS/SCSS styling, component layout, interaction polish, responsive design, and redesign requests. Use when Codex is asked to build or refine frontend screens, avoid generic template-looking UI, choose typography/color/spacing, or review frontend aesthetics.
---

# Frontend UI Taste

Use this skill to make frontend work look intentional, readable, and product-grade instead of generic. Keep it practical: respect the existing product, framework, components, and delivery constraints.

## Workflow

1. Inspect existing UI patterns before changing anything: layout shell, table/form density, colors, spacing, typography, button styles, and component library conventions.
2. Choose one visual direction before coding. Examples: operational cockpit, clean enterprise admin, dense data workstation, calm configuration console, or bold landing-style screen.
3. Preserve established design systems unless the user explicitly asks for a redesign. Improve weak areas without making the page feel from another product.
4. Make the primary workflow obvious. The user should know what to look at first, what action is primary, and what state the system is in.
5. Validate on desktop and mobile or at least narrow-width layout when the page is responsive.

## Design Rules

- Avoid default-template smell: plain white cards stacked with default blue buttons, equal-weight everything, random icon use, and generic gradients.
- Use hierarchy deliberately: one primary title area, one primary action, clear secondary actions, subdued metadata.
- Prefer fewer stronger visual decisions over many small decorations.
- For admin systems, optimize density and scanability: tables, filters, forms, status tags, empty states, and error states must be fast to read.
- Keep Chinese UI comfortable: avoid overly narrow containers for Chinese labels, align form labels cleanly, and keep button text concise.
- Use semantic color: success, warning, danger, info, neutral. Do not invent many status colors without meaning.
- Use whitespace as structure, not padding wallpaper. Align edges across filter bars, tables, forms, and dialogs.
- Add motion only when it explains state change or improves perceived flow; avoid decorative animation that distracts from operations.

## Frontend Implementation Guidance

- When using an existing component library such as Element Plus, Ant Design, Naive UI, or internal components, customize through local layout, tokens, wrapper classes, and scoped styles rather than fighting the library.
- Define or reuse CSS variables for page-level visual direction when doing broader styling.
- Prefer responsive grids, flexible widths, and overflow handling over fixed pixel layouts.
- For tables: make search/filter areas compact, keep operations predictable, use status tags, show important timestamps, and handle long text with tooltip/ellipsis.
- For dialogs/forms: group fields by task, keep footer actions stable, and make destructive or secondary actions visually subordinate.
- For dashboards: avoid meaningless charts. Every card should answer an operational question.

## Interaction Rules

- Every async action needs visible feedback: loading for pending, success message for completion, and actionable error message for failure.
- Prevent duplicate submissions for create, update, delete, test, dispatch, retry, import, export, and batch operations.
- Dangerous actions need confirmation and must name the affected object or count. Avoid vague prompts such as "Are you sure?"
- If closing a dialog or leaving a page would discard edited data, warn before losing changes.
- Primary and secondary actions must stay predictable: primary action on the right in dialog footers, cancel/close visually weaker, destructive action separated or colored as danger.
- Disable unavailable actions with a reason when feasible, instead of hiding important capabilities without explanation.
- For long-running operations, show progress, current step, or a refreshable status instead of a silent spinner.
- Batch operations must show selected count and impact scope before execution.
- Form validation should happen near the field and use language that tells the user how to fix it.
- Error messages should preserve useful backend detail when safe, but wrap it with user-facing context.
- Keep keyboard and pointer flow simple: focus first invalid field, avoid trapping users in nested dialogs, and make Enter/Esc behavior predictable.
- Empty states should explain what is missing and offer the next best action when one exists.
- After create/update/delete, refresh the affected list or detail area so the UI reflects reality immediately.

## Review Checklist

Before finishing frontend UI work, check:

- The page has a clear focal point and primary action.
- Empty, loading, success, failure, and disabled states are considered when relevant.
- Async and destructive interactions provide feedback, confirmation, and duplicate-click protection.
- Text length in Chinese will not break layout.
- Colors and tags map to real meanings.
- Mobile or narrow viewport does not collapse awkwardly.
- The result matches the existing product unless a redesign was requested.

## When To Push Back

If the requested UI would reduce usability, say so briefly and propose a better variant. Common cases: too many primary buttons, hidden critical status, low contrast, over-dense forms without grouping, or decorative visuals that slow down an operational workflow.
