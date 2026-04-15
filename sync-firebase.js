/**
 * sync-firebase.js — main sync script
 *
 * Usage:  node sync-firebase.js
 *
 * This is the single source of truth for all configuration. It reads every
 * credential and option from .env, passes them explicitly to fetchPosts(),
 * then uploads each document to Firestore via sendToFirestore().
 *
 * Required .env:
 *   NOTION_API_KEY             Notion integration token
 *   NOTION_DB_ID               Notion database / data-source ID
 *   FIREBASE_SERVICE_ACCOUNT   path to service account JSON file
 *   FIREBASE_PROJECT_ID        Firebase project ID
 *
 * Optional .env overrides (defaults shown):
 *   FIRESTORE_COLLECTION=posts
 *   NOTION_SHOW_PROPERTY=show
 *   NOTION_DOC_ID_PROPERTY=     (auto-detect unique_id column if blank)
 */

import "dotenv/config";
import { readFileSync } from "node:fs";
import admin from "firebase-admin";
import { fetchPosts } from "./notion.js";

// ─────────────────────────────────────────────
// Config — all env reads are here, nowhere else
// ─────────────────────────────────────────────

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const NOTION_SHOW_PROPERTY = process.env.NOTION_SHOW_PROPERTY?.trim() || "show";
const NOTION_DOC_ID_PROPERTY = process.env.NOTION_DOC_ID_PROPERTY?.trim() || "ID";

const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const COLLECTION = process.env.FIRESTORE_COLLECTION?.trim() || "Writings";

// ─────────────────────────────────────────────
// Firebase init
// ─────────────────────────────────────────────









function initFirebase() {
  if (!FIREBASE_PROJECT_ID) {
    throw new Error("FIREBASE_PROJECT_ID is not set in .env");
  }

  // CI: pass raw JSON via FIREBASE_SERVICE_ACCOUNT_JSON
  // Local: pass file path via FIREBASE_SERVICE_ACCOUNT
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let serviceAccount;
  if (rawJson) {
    serviceAccount = JSON.parse(rawJson);
  } else if (FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(readFileSync(FIREBASE_SERVICE_ACCOUNT, "utf8"));
  } else {
    throw new Error(
      "Set FIREBASE_SERVICE_ACCOUNT_JSON (raw JSON string) or FIREBASE_SERVICE_ACCOUNT (file path) in .env\n" +
        "Get it from: Firebase Console → Project Settings → Service Accounts → Generate new private key"
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: FIREBASE_PROJECT_ID,
  });

  return admin.firestore();
}

// ─────────────────────────────────────────────
// sendToFirestore — upload docs to a collection
// ─────────────────────────────────────────────

/**
 * Writes each document to Firestore.
 *
 * @param {FirebaseFirestore.Firestore} db         - Firestore instance
 * @param {string}                      collection  - Target collection name
 * @param {Array}                       docs        - Array of flat doc objects with `_docId`
 * @returns {Promise<number>} Count of docs uploaded
 */
async function sendToFirestore(db, collection, docs) {
  let uploaded = 0;

  for (const post of docs) {
    const docId = post._docId;
    // Strip the internal routing field before writing
    const { _docId, ...doc } = post;

    await db.collection(collection).doc(docId).set(doc);
    console.log(`  uploaded: ${docId}`);
    uploaded++;
  }

  return uploaded;
}

// ─────────────────────────────────────────────
// main — ties everything together
// ─────────────────────────────────────────────

async function main() {
  if (!NOTION_API_KEY) throw new Error("NOTION_API_KEY is not set in .env");
  if (!NOTION_DB_ID) throw new Error("NOTION_DB_ID is not set in .env");

  // 1. Fetch posts from Notion
  console.log("Fetching posts from Notion...\n");
  const posts = await fetchPosts({
    apiKey: NOTION_API_KEY,
    dbId: NOTION_DB_ID,
    showProperty: NOTION_SHOW_PROPERTY,
    docIdProperty: NOTION_DOC_ID_PROPERTY,
  });

  if (posts.length === 0) {
    console.log("No posts to sync.");
    return;
  }

  // 2. Init Firebase
  const db = initFirebase();

  // 3. Upload to Firestore
  console.log(
    `\nUploading ${posts.length} post(s) → collection "${COLLECTION}"\n`
  );
  const count = await sendToFirestore(db, COLLECTION, posts);

  console.log(`\nDone: ${count} doc(s) saved to "${COLLECTION}".`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
