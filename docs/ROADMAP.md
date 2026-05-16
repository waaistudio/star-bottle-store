# Starry Echo Store-Ready Roadmap

## Phase 1: MVP Experience

Goal: make the core anonymous healing loop usable without real payments or logistics.

- Home Beach: drifting bottles, compose entry, inbox badge, white-noise toggle.
- Compose: 300-character bottle writing, tags, send feedback.
- Read & Reply: read a stranger bottle, reply by text or quick warmth actions, report/block.
- Inbox & Profile: received replies, energy badge, star fragments, send starlight thanks.
- Local state: reducer actions mirror backend mutations so Firebase/API can replace them later.

Release gate:

- All core screens render on iOS and Android.
- No forced audio playback.
- Report/block is visible from user-generated content surfaces.
- Paid and physical redemption CTAs are clearly marked as future phases.

## Phase 2: Backend, Safety, AI Lighthouse, And Virtual Paid Items

Goal: make the app production-safe and monetizable with platform-compliant virtual purchases.

- Auth: anonymous sign-in, account linking, account deletion.
- Database: users, bottles, replies, reports, moderation queues, purchase ledger.
- Dispatch: random bottle assignment, anti-spam limits, duplicate-pick prevention.
- AI Lighthouse: scheduled job sends a clearly labeled AI reply after 24 hours without human reply.
- Moderation: pre-send text checks, crisis keyword detection, report queue, block graph, rate limits.
- Virtual economy: star bottles and star fragments through Apple/Google in-app purchases.
- Receipts: validate App Store and Play Billing receipts on the server.
- Abuse prevention: prevent self-farming, payment replay, refund abuse, and scripted replies.

Release gate:

- No payment flow ships without receipt validation.
- AI replies identify themselves as AI.
- Crisis content returns supportive copy and appropriate external resources.
- Users can report, block, delete account, and request data deletion.

## Phase 3: Physical Warmth Fulfillment

Goal: convert virtual kindness into real-world gift packs safely and operationally.

- Redemption: physical gift pack catalog, availability, eligibility, and point cost.
- Fulfillment: order creation, address collection, delivery status, inventory, cancellation.
- Privacy: address records are separated from anonymous social identity where possible.
- Support: refund/replacement workflow, customer support notes, admin audit trail.
- Logistics: carrier integration or manual export workflow.

Release gate:

- Shipping address handling is covered in privacy policy.
- Refund and support policies are visible before redemption.
- Admin can pause redemption when inventory or moderation risk requires it.

## Phase 4: Store Submission

- EAS Build profiles for development, preview, and production.
- App icons, splash assets, screenshots, and store descriptions.
- Privacy policy, terms, deletion instructions, and moderation policy.
- TestFlight and Google Play closed testing.
- Accessibility pass: text sizing, contrast, tap targets, screen reader labels.
- Final review checklist for Apple App Review and Google Play User Generated Content policy.
