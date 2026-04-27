# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies
- `npx expo start` — start the Metro dev server; scan the QR code with Expo Go
- `npx expo start --android` / `--ios` / `--web` — launch directly on a platform (also exposed as `npm run android|ios|web`)
- `npm run typecheck` — `tsc --noEmit` against the strict config (the only static check in the repo; there are no tests or linter)
- `npx expo start --tunnel` — uses the bundled `@expo/ngrok` when the phone and dev machine can't share a LAN

## Environment

`EXPO_PUBLIC_API_URL` is **required** — `lib/api.ts` throws at verify time if it's missing. Point it at the YOLOv8 backend hosted in the sibling `fishing-kit-poc` repo (e.g. `http://<lan-ip>:8000`). Because it uses the `EXPO_PUBLIC_` prefix, the value is inlined into the JS bundle at build time; changing `.env` requires restarting Metro.

## Architecture

**Stack:** Expo SDK 54 + React Native 0.81 + React 19, TypeScript strict, expo-router v6 (file-based routing).

**Navigation flow** — three-screen stack defined by the files in [app/](app/) and wired in [app/_layout.tsx](app/_layout.tsx):

`index` (pick image + manifest) → `preview` (confirm + submit) → `results` (show verification report)

The `results` screen disables gestures and the back button; users exit via "Verify Another" which calls `resetAll()` and replaces the route back to `/`.

**Shared state — [lib/session.tsx](lib/session.tsx):** a single React Context (`KitSessionProvider`) wraps the router in `_layout.tsx` and holds everything the screens pass between each other: `selectedImageUri`, user-uploaded `manifest`, verification `report`, and `errorMessage`. Screens read it via `useKitSession()`. There is no other state layer (no Redux/Zustand, no persistence) — refreshing the app clears the session.

**Manifest fallback:** `activeManifest` in the session is `manifest ?? DEFAULT_MANIFEST`. [lib/manifest.ts](lib/manifest.ts) exports a baked-in `DEFAULT_MANIFEST` (Fishing Kit POC) that's used when the user hasn't uploaded one. The API call only sends the manifest field when the user explicitly uploaded one — the backend has its own default otherwise.

**Backend contract — [lib/api.ts](lib/api.ts):** `verifyKit` POSTs `multipart/form-data` to `${EXPO_PUBLIC_API_URL}/verify` with:
- `image` — file part (MIME guessed from the URI extension: png/heic/jpeg)
- `manifest` — JSON-stringified manifest (only when the user uploaded one)

Response is parsed into [types/kit.ts](types/kit.ts) `VerificationReport`: `{ passed, correct, missing, unexpected, wrong_quantity, needs_review }`. Every dictionary field defaults to `{}` and `needs_review` to `[]` so the UI renders safely even with a partial payload.

**Manifest validation — [lib/manifest.ts](lib/manifest.ts):** `loadManifest` uses `expo-file-system/legacy` (the new SFA API doesn't expose `readAsStringAsync` the same way) and runs `isManifest` as a runtime type guard. Expected shape: `{ kit_name: string, version: string, components: Record<string, number> }` where every component count is a finite non-negative number.

**Theming:** [lib/theme.ts](lib/theme.ts) exports `colors`, `spacing`, `radii`, `shadows` as `as const` tokens. Prefer these over hardcoded values in styles; only the tonal result-card palettes (success/warning/danger) live inline in [components/KitResultCard.tsx](components/KitResultCard.tsx).

## Conventions

- Path style: sibling imports use relative paths (`../lib/session`, `../types/kit`). There is no `@/` alias configured.
- Styling: per-file `StyleSheet.create` blocks at the bottom of each component. No styled-components or Tailwind.
- The `manifest` form field is only appended to the request when the user explicitly uploaded one — don't unconditionally send `activeManifest`, or the backend default behavior breaks.
