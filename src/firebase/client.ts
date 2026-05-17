import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, signInAnonymously } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

import { getFirebasePublicConfig } from "@/firebase/config";

export type FirebaseClient = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

let cachedClient: FirebaseClient | null = null;

export function getFirebaseClient(): FirebaseClient | null {
  if (cachedClient) {
    return cachedClient;
  }

  const config = getFirebasePublicConfig();
  if (!config) {
    return null;
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  cachedClient = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  };

  return cachedClient;
}

export async function ensureAnonymousUser() {
  const client = getFirebaseClient();

  if (!client) {
    return null;
  }

  if (client.auth.currentUser) {
    return client.auth.currentUser;
  }

  const credential = await signInAnonymously(client.auth);
  return credential.user;
}
