# 星海回音 Starry Echo

StarBottleApp is an anonymous, warm, cross-platform social app where people can place worries into virtual bottles, let them drift through a healing ocean, and receive gentle replies from strangers or an AI lighthouse fallback.

## Current Stack

- Expo SDK 54
- React Native 0.81
- TypeScript
- Expo Router
- Local reducer state with Firebase Auth/Firestore write-through when configured

## Implemented

- Screen 1: Home Beach, with time-aware ocean tone, floating bottle widgets, inbox unread dot, and compose FAB.
- Screen 2: Compose, with paper-like writing UI, 300-character counter, tag chips, and bottle-send feedback animation.
- Shared UI components for ocean background, bottle widgets, and tags.
- Initial data models for `User`, `Bottle`, and `Reply`.
- Firebase Web config support, anonymous auth bootstrap, Firestore write-through for bottles/replies/reports, and local fallback when Firebase is unavailable.

## Roadmap To Store-Ready App

### Phase 1: MVP Experience

- Complete Read & Reply screen.
- Complete Inbox & Profile screen.
- Add bottom tab navigation.
- Add local mock flows for pick bottle, reply, thank with starlight, report, and block.
- Add white-noise setting with explicit user control.

### Phase 2: Backend, Safety, And Paid Virtual Items

- Finish Firebase Console/CLI enablement for Anonymous Auth and Firestore.
- Add user profile persistence and Firestore snapshot subscriptions.
- Add random bottle dispatch logic.
- Add 24-hour AI lighthouse fallback job.
- Add text moderation, rate limits, report/block workflows, and crisis-content handling.
- Add paid virtual items such as star bottles and star fragments through platform-compliant in-app purchases.

### Phase 3: Physical Warmth Fulfillment

- Add real gift pack redemption flow.
- Add order, delivery address, inventory, fulfillment, refund, and customer support records.
- Add admin tools for logistics and moderation.
- Add store policy, privacy policy, and user deletion flow.

### Phase 4: Release

- Configure EAS Build.
- Prepare TestFlight and Google Play internal testing.
- Add app icons, splash assets, store screenshots, privacy nutrition labels, and review notes.
- Run device QA, accessibility checks, and policy review.
