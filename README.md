# Gym Tracker

A local-first React Native / Expo app for iOS, Android, and browser preview. No account or backend. Includes Full Legs (7 exercises), Full Upper (7), and Full Body (8), each defaulting to 4 × 12. Existing Leg Day and Arms Day routines remain available.

## Run on a phone

Use Node 20.19+ (Node 22 recommended).

```sh
npm install
npx expo start
```

Install Expo Go compatible with Expo SDK 55 and scan the QR code (Camera on iOS; Expo Go on Android). Keep the phone and computer on the same Wi-Fi. If your installed Expo Go requires a newer SDK, use a compatible development build or upgrade Expo with its official upgrade guide. Run `npm run ios` or `npm run android` for an installed simulator/emulator; `npm run web` for a browser.

## Use

1. Start a template from Home, or use Settings to customize exercises. Defaults are 4 sets × 12 reps. Tap an exercise to edit; arrows reorder it within its category.
2. Tap a configured workout to start. Enter kg and actual reps, then check each completed set. Previous completed-session weights are prefilled but unchecked. Editing a checked value unchecks it. Apply-first-weight asks before replacing other set weights.
3. Pause or leave the session and resume from Home. An unfinished session is persisted after every change. The timer shows wall time since start, including pauses.
4. Finish saves a permanent snapshot. Unchecked sets remain marked unfinished and do not count toward progress. History retains the exercise name and targets as recorded even after routine edits/deletion.
5. Progress compares the same exercise ID and actual rep count. Each point is the heaviest completed matching set per session. Choose another rep count to compare it. Deleted exercises remain selectable through history. Shared template exercises use one progress identity across workouts; their sets/reps can still be edited per workout.
6. Settings exports the complete JSON record, including the routine and draft session. On phones this uses the system share sheet; on web it downloads a file. The web Profile → On your phone panel exports and restores full backups including your profile and photo. Restore previews the session count and asks before replacing this device’s records.

Records are saved with AsyncStorage in one versioned document. Writes are serialized to prevent older changes overwriting newer changes. Loading failures do not replace existing data; write failures are visible with retry. Uninstalling the app or clearing browser storage removes local records, so export before moving devices.

## Verification

```sh
npm run typecheck
npm test
npx expo export --platform all
```

Model tests cover per-set weights, previous-weight prefills, serialized session restoration, immutable historical snapshots, exercise deletion, comparable-rep progress, and invalid/skipped sets. Real-device lifecycle and touch behavior should also be checked with Expo Go.

Template installation runs once and preserves existing routines, snapshots, and drafts. A pre-install copy of existing saved data is retained under `gym-tracker:v1:before-templates` in local storage. Existing matching placements keep their customized sets/reps. No workout history is seeded.

## Appearance

The moon/sun icon switches between Light and Dark. The preference is stored separately from workout data and survives app restarts. Both modes use the same routines and history.

## Profile and 90-day preview
Open the profile icon to edit your name, photo and height, or add a dated weigh-in. Profile details are stored locally, separately from workouts. Body-weight charts appear in Profile and Progress. Same-date entries update the existing weigh-in.

Open `/?demo=90` or use Profile → Preview 90 days of sample data to explore fictional workouts and body weights. Demo edits stay in memory. Exit restores the original data. The Home calendar counts distinct training days and supports browsing previous months.

## Personal installed web app

Run `npm run build` to export the web app with its manifest and offline service worker. The hosted site is owner-private. Open it online and sign in with the owning ChatGPT account, then add it to the phone home screen. After assets finish caching, the app can record workouts offline; external videos require internet. Records are device-local, not synchronized. Download a full backup from Profile on the old device and restore it on the new device. Keep backups before clearing storage or uninstalling.
