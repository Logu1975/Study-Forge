# StudyForge product principles

These ten priorities apply to every stage. If a stage plan ever conflicts with
them, the priorities win.

1. **Themes are a headline feature.** The anime-inspired theme system is part
   of the product identity. Themes must be easy to discover and switch from
   the dashboard and from settings, not buried in a menu.
2. **Original designs only.** Themes are inspired by anime aesthetics
   (palettes, shapes, motion, mood). They never copy copyrighted characters,
   logos, artwork, or assets.
3. **Polished and memorable, but fast.** A premium, modern look that still
   runs well on low-end phones and laptops. Visuals are CSS and SVG, not heavy images.
4. **Lightweight motion.** Smooth transitions and micro-interactions that
   explain what changed. Everything respects the "reduce motion" setting.
5. **A real product, not a CRUD demo.** The dashboard should answer "what
   should I do next?" with real data: goals, streaks, upcoming quizzes, progress.
6. **Accessibility, performance and usability come first.** When decoration
   conflicts with any of these, decoration loses.
7. **The AI assistant starts local.** A MockProvider behind an `AiProvider`
   interface. No Gemini or other paid API is required, ever, for the MVP.
8. **Bug Finder and Bug Shield are real engineering.** Shield contains and
   recovers from errors. Finder records and diagnoses them. Both must work
   and be testable, not just be described.
9. **Build incrementally.** After each stage: exact commands to run plus a
   short testing checklist, and no starting the next stage until it passes.
10. **Beginner-readable code.** Small files, clear names, comments that
    explain why. Important files are explained when they are introduced.

## Definition of done (every stage)

- [ ] Runs with the documented commands
- [ ] Anything that loads data has loading, error and empty states
- [ ] Usable with the keyboard only; focus is always visible
- [ ] Touch targets are at least 44px
- [ ] Works at 360px wide and on desktop
- [ ] Respects reduced motion
- [ ] `npm test`, `npm run typecheck` and `npm run build` pass
