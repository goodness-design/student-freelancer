# StudentFreelance

A freelance marketplace built for university students in Nigeria — students offer services (web dev, design, writing, tutoring, and more), clients hire and pay in ₦. Built as a static HTML/CSS/JS frontend backed by Firebase (Authentication + Firestore).

---

## Tech Stack

- **Frontend:** Plain HTML, CSS, and vanilla JavaScript (ES modules) — no framework or build step
- **Auth:** Firebase Authentication (email/password + Google sign-in)
- **Database:** Cloud Firestore
- **Hosting:** Vercel
- **Fonts:** Plus Jakarta Sans (headings), Inter (body) — loaded via Google Fonts

No bundler, no `npm install` required to run the frontend — open the HTML files or serve the folder directly.

---

## Project Structure


---

## Getting Started

### 1. Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password and Google sign-in methods
3. Enable **Cloud Firestore** (not Realtime Database — they're separate products with similar names; this project uses Firestore)
4. Copy your web app config into the `firebaseConfig` object at the top of each page's `<script type="module">` block (currently duplicated per-page — see Known Issues)

### 2. Firestore security rules

Paste into **Firestore → Rules**:

match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Wallet balances are READ-only from the client. Writes must go through
// a trusted backend — see "Payments" in Known Issues.
match /wallets/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if false;

  match /transactions/{transactionId} {
    allow read: if request.auth != null && request.auth.uid == userId;
    allow write: if false;
  }
}

match /{document=**} {
  allow read, write: if false;
}


New collections (services, orders, reviews, messages) will need their own rules added as those features go live server-side.

### 3. Run locally

Since pages use ES module `<script type="module">` imports, opening files directly via `file://` won't work — serve the folder over HTTP:

```bash
npx serve .
# or
python3 -m http.server
```

### 4. Deploy

Deployed via Vercel. **`vercel.json` with `{ "trailingSlash": true }` is required** at the project root — without it, visiting a folder URL without a trailing slash (e.g. `/dashboard` instead of `/dashboard/`) breaks every relative link on that page.

---

## Known Issues / Not Yet Implemented

Being upfront about the gap between "looks finished" and "is finished":

- **Admin folder** (`admin/index.html`, users, services, orders, transactions, reports, settings) — not built yet
- **`dashboard/services.html`** — linked from the sidebar's "Explore" item but never created; either build it or point the link to `../marketplace/index.html`
- **`complete-profile.html`, `terms.html`, `privacy.html`** — referenced by signup flow and footer links, not yet built
- **Payments are not real.** Wallet balances/transactions are read-only from Firestore by design (client-side writes are blocked in the rules above, on purpose) — actually moving money requires a backend (Firebase Cloud Functions + a processor like Paystack/Flutterwave) that isn't built yet. The "Withdraw Funds" button currently only shows a placeholder message.
- **Two-factor authentication toggle is cosmetic.** It saves a preference flag to Firestore but does not enforce real 2FA — that needs Firebase's separate Multi-Factor Auth flow (phone verification, reCAPTCHA).
- **Reviews and ratings are static/hardcoded.** Making them real needs a `reviews` Firestore collection, written wherever orders actually get marked complete.
- **Portfolio images use plain URL text fields**, not real file upload — a proper "upload from device" flow needs Firebase Storage wired in separately.
- **Mobile messages inbox:** below 900px, the chat pane is hidden and there's currently no JS to reopen it after tapping a conversation — the conversation list is visible but the chat itself isn't reachable yet on small screens.
- **Firebase config is duplicated** across every page's inline script rather than centralized in one shared module — works, but any config change means updating it everywhere.
- **Auth guards were added page-by-page** (dashboard, profile, reviews, settings, wallet) — double check any dashboard page not explicitly covered in this list still has the `onAuthStateChanged` redirect-if-logged-out pattern before treating it as protected.

---

## Roadmap

1. Build the admin folder
2. Real payment backend (Cloud Functions + payment processor)
3. Real reviews/ratings pipeline tied to completed orders
4. Firebase Storage for real image uploads (portfolio, profile photo)
5. Centralize Firebase config into one shared module
6. Mobile chat-pane toggle for the messages inbox
7. Real 2FA via Firebase Multi-Factor Auth
