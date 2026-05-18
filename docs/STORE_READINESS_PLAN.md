# Store Readiness Plan

_Last updated: 2026-05-18_

## Current Progress

- Expo SDK 54 / React Native 0.81 app builds with Expo Router.
- MVP screens exist for Home Beach, Compose, Read & Reply, Inbox/Profile, and Safety & Account.
- Firebase anonymous auth and Firestore write-through skeleton are wired for bottles, replies, and reports, with local fallback.
- Android and iOS static exports pass locally.
- Safety baseline exists: crisis-keyword draft blocking, bottle reporting, and reply reporting from inbox.
- Monetization and physical fulfillment flows are intentionally disabled behind clear copy until platform-compliant implementations exist.

## Verified Locally

```bash
npm run typecheck
npm run export:android
npm run export:ios
```

## Immediate MVP Gaps

1. Add persistent local preferences for white-noise opt-in and draft bottles.
2. Add empty/loading/error states to each screen, especially inbox and read/reply.
3. Replace placeholder bottom-nav routes with real destination screens or hide unavailable tabs.
4. Add visual QA screenshots for common iPhone/Android sizes.
5. Add more complete accessibility labels and touch target checks.

## Backend & Safety Gaps Before Public Testing

1. Enable Firebase Anonymous Auth and production Firestore project.
2. Implement Firestore snapshot subscriptions so inbox and drifting bottles sync across sessions/devices.
3. Implement bottle dispatch logic to avoid showing a user's own bottles and to rate-limit distribution.
4. Build moderation pipeline for bottles/replies, including crisis handling and reviewer queue.
5. Add block graph and duplicate-report prevention server-side.
6. Add account/data deletion request flow backed by a server process.

## Paid Items / Physical Fulfillment Gaps

1. Virtual star bottles/fragments must use Apple/Google in-app purchases, not external checkout.
2. Receipt validation and purchase ledger must run server-side.
3. Physical gift-pack redemption needs catalog, shipping address consent, fulfillment states, refund/support policy, and privacy wording.
4. Keep paid and physical flows disabled until policies and backend controls are complete.

## Release Preparation

1. Configure final iOS bundle identifier and Android package in `app.json`/EAS.
2. Run EAS internal builds for iOS and Android.
3. Prepare app icon, splash, screenshots, privacy policy URL, terms URL, age rating answers, and review notes.
4. Complete TestFlight and Google Play closed testing.
5. Add crash reporting and privacy-safe analytics that never collect bottle/reply content.
6. Run device QA, accessibility QA, moderation-policy review, and account deletion verification.
