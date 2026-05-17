# Firebase Setup

## Project

Recommended project id:

```text
star-bottle-app
```

Recommended display name:

```text
Starry Echo
```

## App IDs

- iOS bundle id: `com.waaistudio.starbottle`
- Android package: `com.waaistudio.starbottle`

## Required Firebase Products

- Authentication: enable Anonymous sign-in.
- Firestore Database: create a database in production mode, then apply security rules before release.
- Cloud Functions: Phase 2 dispatch, AI Lighthouse, moderation, and receipt validation.
- Cloud Messaging: Phase 2 push notifications.

## Expo Public Env

Create `.env.local` from `.env.example` and fill:

```text
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Do not put Firebase Admin SDK keys or service account JSON in the app repo.

## Current State

The app includes a safe Firebase client, Firestore service, and local fallback mode. If env values are missing, or if Firebase Authentication/Firestore are not enabled yet, the UI keeps using mock/local state so the MVP remains testable.

Configured locally:

- Firebase Web app config is stored in `.env.local` and ignored by git.
- `.firebaserc`, `firebase.json`, `firestore.rules`, and `firestore.indexes.json` are ready for deployment.
- `StarBottleProvider` attempts anonymous auth on startup and routes bottle creation, replies, and reports through Firebase when available.

Console status on 2026-05-17:

- Firebase project `star-bottle-app` exists.
- Web app `Starry Echo Expo` exists.
- Anonymous Auth toggle was enabled in the Console form, but the Console did not cleanly return after Save.
- Firestore creation returned `Cannot enable Firestore for this project / An unknown error occurred`; retry from Console or Firebase CLI once account/Cloud Shell eligibility is resolved.

After Firebase Console recovers or CLI login is available, run:

```bash
npx firebase-tools deploy --only firestore
```
