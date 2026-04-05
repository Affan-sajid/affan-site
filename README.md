# affansite — the workshop

hey people, welcome to the workshop of my site 👋

this is where i build and tinker. it's a minimal personal site where i write stuff and show off projects — nothing fancy, just a clean space for things i make and think about.

---

## what's going on here

the site pulls content straight from **Notion** and serves it up live. so instead of manually updating a markdown file or messing with a CMS, i just write in Notion and everything flows through automatically.

here's the pipeline:

1. **Notion** — i write my essays and log my projects there. each entry has a `show` toggle so i control what's actually published.
2. **sync script** (`sync-firebase.js`) — a Node script that hits the Notion API, grabs everything marked as `show`, and pushes it to **Firestore**.
3. **Firebase / Firestore** — acts as the database. stores all the content so the site can fetch it fast.
4. **React frontend** — reads from Firestore and renders it all. built with Vite, kept minimal.

so the flow is basically:

```
Notion → sync script → Firestore → React site
```

run the sync whenever you want to push new content:

```bash
node sync-firebase.js
```

---

## stack

- React + Vite
- Firebase / Firestore
- Notion API

---

## setup

copy `.env.example` to `.env` and fill in your keys:

```
NOTION_API_KEY=
NOTION_DB_ID=
FIREBASE_SERVICE_ACCOUNT=path/to/serviceAccount.json
FIREBASE_PROJECT_ID=
```

then:

```bash
npm install
npm run dev
```

---

feel free to poke around. it's a workshop, things might be messy.
