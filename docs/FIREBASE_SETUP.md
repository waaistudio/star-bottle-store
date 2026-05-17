# Firebase Setup

## Project

Recommended project id:

```text
star-bottle-store
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

The app includes a safe Firebase client and Firestore service skeleton. If env values are missing, the UI keeps using mock/local state. After the config is available, the next implementation step is to route `StarBottleProvider` actions through the Firebase service and subscribe to Firestore snapshots.
