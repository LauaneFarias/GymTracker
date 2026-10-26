# GymPlan — Pop strength

## Direction
Playful personal training app inspired by the user's four October references: flat lilac (#D8B5F2), lime (#E2F56B), blue (#4854C7), orange (#F36338) and charcoal (#292929) blocks, oversized upright sans-serif, strong near-black text, sculptural flower accent and pill navigation. No borrowed photography or claims.

## Structure
Home: weekly overview and quick access. Workouts: three plans with exercise previews before starting. Progress: exercise weight chart and history. Settings: accessible from profile. Active session stays visible and must never silently open a different workout.

## Tokens
Single source: src/theme.ts. Light paper #FAFAFB, ink and actions #292929, lilac #D8B5F2, lime #E2F56B, blue #4854C7 and orange #F36338. Blue cards use white text. Dark mode uses the same card accents on charcoal. System sans-serif, upright heavy display, regular body. Spacing: 4/8/12/16/20/24/32. Cards 24px radius; controls minimum 44px.

## Motion
Short fade/slide when switching screens; press spring; gentle flower rotation. Completed sets spring to a checked state. Respect reduced motion and stop ambient animation in background. Navigation remains visible and labelled while scrolling.

## Data
All metrics derive from stored completed sessions. No invented improvement, no predicted gains. Existing workout IDs, history, storage and rep-specific comparisons remain intact.

## Profile and examples
Local profile with selected photo, height in cm and dated weight history in kg. Same-date weigh-ins replace the prior value. Demo mode contains 90 days of explicitly fictional workouts and body weight; writes remain in memory and never replace real records. Month attendance counts unique completed-session dates. Main navigation uses tabs without back arrows.
