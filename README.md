<div align="center">

<br/>

<img src="extension/icons/icon128.png" width="100" height="100" alt="KeyNova Lock Icon"/>

<br/>

# KeyNova
### Professional Password Manager — Chrome Extension

<br/>

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-0ea5e9?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![AES-256-GCM](https://img.shields.io/badge/AES--256--GCM-Encrypted-10b981?style=for-the-badge)](https://www.w3.org/TR/WebCryptoAPI/)
[![Firebase](https://img.shields.io/badge/Firebase-Cloud_Sync-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-f59e0b?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-7dd3fc?style=for-the-badge)](LICENSE)

<br/>

> **Military-grade encryption. Smart autofill. Cloud sync. Zero plaintext stored — ever.**

<br/>

[🔐 Features](#-features) &nbsp;•&nbsp;
[📸 Screenshots](#-screenshots) &nbsp;•&nbsp;
[⚙️ Installation](#️-installation) &nbsp;•&nbsp;
[🔒 How Encryption Works](#-how-encryption-works) &nbsp;•&nbsp;
[☁️ Firebase Setup](#️-firebase-cloud-sync-setup) &nbsp;•&nbsp;
[📁 File Structure](#-file-structure) &nbsp;•&nbsp;
[🚀 How to Use](#-how-to-use)

<br/>

---

</div>

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [How Encryption Works](#-how-encryption-works)
- [File Structure](#-file-structure)
- [Installation](#️-installation)
- [How to Use](#-how-to-use)
- [Security Model](#-security-model)
- [Firebase Cloud Sync Setup](#️-firebase-cloud-sync-setup)
- [Technologies Used](#-technologies-used)
- [Entry Types](#-entry-types-supported)
- [Password Generator](#-password-generator)
- [Autofill System](#-autofill-system)
- [Future Scope](#-future-scope)
- [Academic Details](#-academic-details)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔐 About the Project

**KeyNova** is a professional, full-featured password manager built as a **Google Chrome Extension**. Every credential is encrypted on your device using **AES-256-GCM** before being written to storage or synced to the cloud. Your master password is never stored anywhere — not in Chrome, not in Firebase, not in any log file. This is called **zero-knowledge architecture**.

The extension works **fully offline** by default using Chrome's local storage, and optionally syncs your encrypted vault to **Firebase Firestore** for cross-device access. A companion **marketing website** is also deployed on Firebase Hosting.

> 📌 **Academic Project** — Developed as a final year MCA project at Yadavindra Department of Engineering, Talwandi Sabo, in collaboration with Softwizz Technologies Pvt. Ltd.

### Why KeyNova instead of browser-saved passwords?

| Feature | Chrome Built-in | KeyNova |
|---|---|---|
| Encryption | ❌ None | ✅ AES-256-GCM |
| Master password lock | ❌ No | ✅ Yes |
| Cloud sync (encrypted) | ❌ No | ✅ Firebase |
| Password generator | ❌ Basic | ✅ 3 types, fully custom |
| Multiple entry types | ❌ Passwords only | ✅ 5 types |
| Password history | ❌ No | ✅ Last 5 versions |
| Strength analyser | ❌ No | ✅ Real-time + crack time |
| Smart autofill | ❌ Basic | ✅ Match detection |
| Zero-knowledge | ❌ No | ✅ Yes |
| Free forever | ✅ Yes | ✅ Yes |

---

## ✨ Features

<details>
<summary><strong>🔒 AES-256-GCM Encryption</strong></summary>

- Military-grade encryption — same standard used by banks and governments
- **PBKDF2** key derivation with **100,000 SHA-256 iterations** from your master password
- Fresh **12-byte random IV** generated for every single encryption operation
- Encryption key lives **only in JavaScript memory** — never written to any file
- Uses **Web Crypto API exclusively** — zero third-party cryptographic libraries
- Master password is **never stored** anywhere — not even a hash

</details>

<details>
<summary><strong>⚡ Smart Autofill</strong></summary>

- Detects login forms automatically on any website when you open the popup
- Shows a **green ✓ Match badge** on entries that match the current site
- Dedicated **Autofill Picker screen** listing all matched credentials
- Compatible with **React, Vue.js, and Angular** apps via native HTMLInputElement setter
- A **live pulsing badge** appears in the status bar when a login form is found
- One click fills both username and password fields and closes the popup

</details>

<details>
<summary><strong>🎲 Password Generator — 3 Types</strong></summary>

All generation uses `crypto.getRandomValues()` — never `Math.random()`

- **Password** — charset-based, 8–64 characters, uppercase/lowercase/numbers/symbols, exclude ambiguous
- **Passphrase** — word list based, 3–8 words, customisable separator, capitalise, append number
- **Username** — Adjective+Noun (`cyber_fox73`), Word+Number (`maple4821`), or Random alphanumeric
- Fisher-Yates shuffle for uniform character distribution
- **Live output** with copy and "Use It" (apply to entry form) buttons

</details>

<details>
<summary><strong>🏦 Vault Management</strong></summary>

- **5 entry types** — Password, Secure Note, Wi-Fi, API Key/Token, PIN/Code
- **Categories** — Social, Work, Finance, Shopping, Dev, Personal, Other
- **Tags** — multiple searchable tags per entry
- **Favourites** — star important entries
- **Real-time search** across name, username, URL, and tags
- **4 filter tabs** — All, Favourites, Passwords, Notes
- **Category dropdown** filter

</details>

<details>
<summary><strong>📊 Password Strength Analyser</strong></summary>

- Runs **in real time** as you type
- Score 0–5 based on length, character diversity, and pattern detection
- **5-dot visual indicator** fills with colour by strength level
- **Crack-time estimate** — from "instantly" to "centuries"
- Detects weak patterns: `123`, `abc`, `qwerty`, `pass`, `key`
- Labels: Very Weak → Weak → Fair → Good → Strong → Very Strong

</details>

<details>
<summary><strong>🕐 Password History</strong></summary>

- Every password change automatically saves the previous password
- Stores **up to 5 historical passwords** per entry with timestamps
- **One-click Restore** — revert to any previous password instantly
- Visible in the Edit Entry screen

</details>

<details>
<summary><strong>🗑️ Safe Delete with Animation</strong></summary>

- Custom **confirmation modal** — red warning, entry name displayed
- Card **slides out to the right** with smooth animation before removal
- Cancel button closes modal without deleting
- Deletion synced to Firebase if online

</details>

<details>
<summary><strong>☁️ Firebase Cloud Sync</strong></summary>

- **Email/password sign-in** via Firebase Authentication
- Encrypted vault blob synced to **Cloud Firestore**
- Firebase **never receives plaintext** — only `{iv, data}` encrypted fields
- **Online/Offline status pill** in the status bar — green pulsing when connected
- Manual **Sync button** with spinner animation
- Works fully offline without any Firebase account

</details>

<details>
<summary><strong>🔐 Auto-Lock & Session Safety</strong></summary>

- Vault **auto-locks after 15 minutes** of inactivity
- Background service worker manages the lock alarm
- Encryption key wiped from memory on lock or popup close
- Activity detected on every user interaction

</details>

---

## 📸 Screenshots

> All screenshots show the live KeyNova extension running in Google Chrome.

### Lock Screen & Firebase Sign-In
The lock screen is the entry point every time you open KeyNova. Enter your master password to unlock the vault. The Firebase button opens optional cloud sign-in.

| Lock Screen | Firebase Sign-In |
|---|---|
| ![Lock Screen](screenshots/lock-screen.png) | ![Firebase Sign-In](screenshots/signin-screen.png) |

---

### Vault Screen
The main dashboard showing saved credentials with the Online status badge, search bar, category filter, navigation tabs, and entry cards.

| Vault — Online Badge | Vault — Category Filter |
|---|---|
| ![Vault Online](screenshots/vault-online.png) | ![Vault Filter](screenshots/vault-filter.png) |

---

### Add & Edit Entry
Full entry form with 5 entry types, strength meter, and all action buttons.

| Entry Type Selector | Edit Entry — Strength Meter |
|---|---|
| ![Entry Types](screenshots/entry-types.png) | ![Edit Entry](screenshots/edit-entry-strength.png) |

---

### Password Generator
Three-tab generator with live output and customisation controls.

| Password Tab | Passphrase Tab | Username Tab |
|---|---|---|
| ![Password Gen](screenshots/gen-password.png) | ![Passphrase Gen](screenshots/gen-passphrase.png) | ![Username Gen](screenshots/gen-username.png) |

---

### Firebase Backend — Proof of Zero-Knowledge

| Firebase Console | Authentication Users |
|---|---|
| ![Firebase Console](screenshots/firebase-console.png) | ![Firebase Auth](screenshots/firebase-auth.png) |

| Firestore — Encrypted Data Only |
|---|
| ![Firestore Encrypted](screenshots/firestore-encrypted.png) |

> 🔐 **Notice:** Firestore only stores `data` (ciphertext) and `iv` — no readable passwords, usernames, or any plaintext.

---

### KeyNova Website on Firebase Hosting

| Hero Section | Features Section |
|---|---|
| ![Website Hero](screenshots/website-hero.png) | ![Website Features](screenshots/website-features.png) |

| Live Generator Demo | Security Section |
|---|---|
| ![Website Generator](screenshots/website-generator.png) | ![Website Security](screenshots/website-security.png) |

---

## 🔒 How Encryption Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    KEYNOVA ENCRYPTION FLOW                       │
│                                                                   │
│  STEP 1 — You type your master password                          │
│           "myMasterPassword123"                                   │
│           ↓                                                       │
│  STEP 2 — Random 16-byte salt generated                          │
│           crypto.getRandomValues(new Uint8Array(16))             │
│           Salt saved in localStorage (not a secret)              │
│           ↓                                                       │
│  STEP 3 — PBKDF2 key derivation                                  │
│           Password + Salt → 100,000 × SHA-256 rounds             │
│           Output: 256-bit AES encryption key (SK)                │
│           ⚠️  Key NEVER stored — lives only in memory            │
│           ↓                                                       │
│  STEP 4 — Vault data converted to JSON bytes                     │
│           { items:[...], cats:[...] } → JSON.stringify           │
│           ↓                                                       │
│  STEP 5 — Fresh 12-byte IV generated                             │
│           crypto.getRandomValues(new Uint8Array(12))             │
│           New IV every single time you save                       │
│           ↓                                                       │
│  STEP 6 — AES-256-GCM encryption runs                            │
│           Key + IV + Data → Ciphertext                           │
│           Output: random-looking bytes — completely unreadable   │
│           ↓                                                       │
│  STEP 7 — Base64 encoding                                        │
│           { iv: "rAnDoMbYtEs==", d: "XkR9mP2tQs7..." }          │
│           ↓                                                       │
│  STEP 8 — Saved to chrome.storage.local                          │
│           OR synced to Firebase Firestore (same blob)            │
│                                                                   │
│  What Firebase EVER sees:  { iv: "...", data: "..." }            │
│  What Firebase NEVER sees: passwords, usernames, any text        │
└─────────────────────────────────────────────────────────────────┘
```

### The core security code

```javascript
// PBKDF2 key derivation — 100,000 rounds
async function deriveKey(pw, salt) {
  const raw = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    raw,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// AES-256-GCM encryption
async function enc(key, obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12));   // fresh IV
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(JSON.stringify(obj))
  );
  return { iv: b64(iv), d: b64(ct) };   // only this goes to storage
}
```

---

## 📁 File Structure

```
keynova/
│
├── 📄 README.md
│
├── extension/                          ← Load this folder in Chrome
│   │
│   ├── 📄 manifest.json               ← Extension config, permissions, icons
│   │
│   ├── popup/
│   │   ├── 📄 popup.html              ← All 7 screens (Lock/Vault/Entry/Gen/Autofill/SignIn/Forgot)
│   │   ├── 📄 popup.css               ← Dark blue/black theme, all animations
│   │   └── 📄 popup.js                ← All logic: crypto, vault, autofill, generator, Firebase
│   │
│   ├── background/
│   │   └── 📄 service-worker.js       ← Auto-lock alarm (15 min inactivity)
│   │
│   ├── content/
│   │   └── 📄 content-script.js       ← Login form detection + autofill
│   │
│   ├── 📄 firebase-config.js          ← Your Firebase SDK config (fill this in)
│   │
│   └── icons/
│       ├── 🖼️ icon16.png              ← Toolbar icon (16×16)
│       ├── 🖼️ icon32.png              ← Extensions page (32×32)
│       ├── 🖼️ icon48.png              ← Standard size (48×48)
│       └── 🖼️ icon128.png             ← Web Store listing (128×128)
│
└── website/
    ├── 📄 firebase.json               ← Firebase Hosting config
    ├── 📄 firestore.rules             ← UID-scoped Firestore security rules
    ├── 📄 .firebaserc                 ← Firebase project reference
    └── public/
        └── 📄 index.html             ← Complete marketing website (single file)
```

### What each file does

| File | Size | Purpose |
|---|---|---|
| `popup.js` | ~700 lines | Complete app logic — crypto, CRUD, autofill, generator, Firebase, delete |
| `popup.html` | ~230 lines | HTML for all 7 screens |
| `popup.css` | ~420 lines | Dark theme, all animations, modal, status bar |
| `content-script.js` | ~45 lines | Injected into every tab — form detection and autofill |
| `service-worker.js` | ~22 lines | Background alarm for 15-minute auto-lock |
| `manifest.json` | ~40 lines | Chrome extension configuration and permissions |
| `website/public/index.html` | ~650 lines | Full marketing website with live generator demo |

---

## ⚙️ Installation

### Load from source — Developer Mode

> **Requires:** Google Chrome 88 or newer

**Step 1 — Clone or download**
```bash
git clone https://github.com/YOUR_USERNAME/keynova.git
```
Or download the ZIP from the green **Code** button above and extract it.

**Step 2 — Open Chrome Extensions**
```
Type in Chrome address bar:   chrome://extensions
```

**Step 3 — Enable Developer Mode**
```
Toggle the "Developer mode" switch → top-right corner → ON
```

**Step 4 — Load the extension**
```
Click "Load unpacked"
→ Navigate to the keynova/ folder
→ Select the extension/ subfolder
→ Click "Select Folder"
```

**Step 5 — Pin to toolbar**
```
Click the puzzle piece 🧩 in Chrome toolbar
→ Find KeyNova
→ Click the pin 📌 icon
```

**Step 6 — First use**
```
Click the KeyNova 🔒 icon
→ Enter any password — this becomes your master password
→ Your encrypted vault is created instantly
```

> ⚠️ **Important:** Your master password is **never stored anywhere**. If you forget it, the vault cannot be recovered — only wiped and reset. Choose a memorable password.

---

## 🚀 How to Use

### Unlock your vault

1. Click the **KeyNova** 🔒 icon in your toolbar
2. Type your master password and click **Unlock Vault** (or press Enter)
3. The vault opens — your encrypted entries are decrypted in memory

### Add a new entry

1. Click the blue **+** button (bottom-right of vault screen)
2. Select entry type: Password / Secure Note / Wi-Fi / API Key / PIN
3. Fill in Title (required), Username/Email, Password
4. Optionally add: Website URL, Category, Tags, Notes
5. Click **Save** — entry is immediately encrypted and stored

### Generate a strong password

**From the entry form:**
Click the ⚡ **lightning bolt** button next to the password field → Generator opens → adjust settings → click **Generate** → click **↩ Use It** → password is applied to the form

**Standalone:**
Click the ⚡ icon in the vault status bar → Generator screen opens

### Autofill on a website

**Automatic detection:**
1. Go to any login page (e.g. `github.com/login`)
2. Open KeyNova — a **green Autofill badge** appears if a login form is found
3. Click the badge → Autofill Picker shows matched entries
4. Click **Fill ⚡** → form is filled, popup closes automatically

**Quick fill from vault:**
Click the ⚡ button on any entry card in the vault list

### Edit an entry

1. Click anywhere on the entry card info (or the ✏️ button)
2. Make your changes — if you change the password, the old one is saved to history automatically
3. Click **Save**

### View password history

1. Open any entry in edit mode
2. Scroll to the bottom — **Password History** section shows last 5 passwords with dates
3. Click **Restore** to revert to any previous version

### Delete an entry

**From vault list:** Click the 🗑️ button → confirmation modal appears → click **Yes, Delete**

**From edit screen:** Scroll down → click red **🗑️ Delete Entry** → confirm

### Lock your vault

Click the 🔒 **lock icon** in the status bar — vault locks immediately and key is wiped from memory.

---

## 🛡️ Security Model

### Zero-Knowledge Guarantee

| Question | Answer |
|---|---|
| Is my master password stored anywhere? | **Never. Not anywhere.** |
| What does Chrome storage contain? | Only `{ iv: "...", d: "..." }` — encrypted ciphertext |
| What does Firebase store? | Same encrypted blob — no readable data |
| Can the developer read my vault? | **Impossible** — no one can without the master password |
| What happens if I forget my password? | Local vault must be wiped — Firebase vault is preserved |
| Is the encryption key ever saved? | **No** — only in memory variable `SK` during session |

### Cryptographic specifications

| Component | Standard | Detail |
|---|---|---|
| Encryption | AES-256-GCM | 256-bit key, authenticated encryption, tamper-proof |
| Key derivation | PBKDF2-SHA256 | 100,000 iterations, 16-byte random salt |
| IV | CSPRNG | 12 fresh random bytes per encryption via `crypto.getRandomValues()` |
| Password generation | CSPRNG | Fisher-Yates shuffle, `crypto.getRandomValues()` only |
| Encoding | Base64 | Safe text representation of binary encrypted data |
| Crypto API | Web Crypto API | W3C standard, browser-native — no external libraries |

### What is stored in `chrome.storage.local`

```json
{
  "kn_v2": {
    "iv": "NQKyjXoyYiZ8qifb",
    "d":  "2kWotM3xm+NygEP/GSfq9R954nmClwPLQoZ5Ws1hpXczPRUI..."
  }
}
```

That is **all**. No passwords. No usernames. No emails. No master password. Nothing readable.

---

## ☁️ Firebase Cloud Sync Setup

> Firebase is **optional**. KeyNova works completely offline without it.

### Step 1 — Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `keynova` → Create
3. Enable **Authentication** → Sign-in method → Email/Password → Save
4. Enable **Firestore Database** → Create database → Production mode → `asia-south1`
5. Enable **Hosting** → Get started (follow the wizard)

### Step 2 — Get Your SDK Config

1. Click ⚙️ **Project Settings** → scroll to **Your apps**
2. Click **`</>`** web icon → Register app as `keynova-web`
3. Copy the `firebaseConfig` object

### Step 3 — Fill In `firebase-config.js`

Open `extension/firebase-config.js` and replace the placeholder values:

```javascript
export const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyXXXXXXXXXXXXXXXXXXXX",
  authDomain:        "keynova-xxxxx.firebaseapp.com",
  projectId:         "keynova-xxxxx",
  storageBucket:     "keynova-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:abcdef1234567890"
};
```

### Step 4 — Deploy Website (Optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Navigate to website folder
cd keynova/website

# Initialize (select Hosting + Firestore, public dir = public, SPA = yes)
firebase init

# Deploy
firebase deploy

# Your site is live at: https://keynova-xxxxx.web.app
```

### Step 5 — Firestore Security Rules

The `firestore.rules` file enforces that each user can only access their own vault:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vaults/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|---|---|---|
| [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/) | W3C Standard | AES-256-GCM encryption, PBKDF2 key derivation, secure random |
| [Chrome Extensions API](https://developer.chrome.com/docs/extensions/mv3/) | Manifest V3 | Extension platform: storage, tabs, scripting, alarms |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | ES2022 | All application logic — async/await, ES modules |
| [Firebase Auth](https://firebase.google.com/docs/auth) | SDK v10 | Email/password sign-in for cloud sync |
| [Cloud Firestore](https://firebase.google.com/docs/firestore) | SDK v10 | Encrypted vault cloud storage |
| [Firebase Hosting](https://firebase.google.com/docs/hosting) | — | Marketing website deployment (CDN + SSL) |
| HTML5 | — | All 7 popup screens |
| CSS3 | — | Dark theme, animations, flexbox, CSS variables |

> **Zero runtime dependencies.** No npm packages in the extension. No external JS libraries. Everything is browser-native.

---

## 📋 Entry Types Supported

| Icon | Type | Typical Use | Key Fields |
|---|---|---|---|
| 🔑 | **Password** | Website logins, app accounts | Username, Password, URL |
| 📝 | **Secure Note** | Private text, codes, secrets | Note content |
| 📶 | **Wi-Fi Credentials** | Network passwords | Network name, Wi-Fi password |
| 🔐 | **API Key / Token** | Developer keys, tokens, secrets | Service name, Key value |
| 🔢 | **PIN / Code** | Bank PINs, door codes, OTPs | PIN value |

All entry types support: **Category, Tags, Favourites, Notes, and Password History**.

---

## 🎲 Password Generator

### How the randomness works

```javascript
// Cryptographically secure — never Math.random()
function ri(n) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
}

// Build character pool from selected options
let pool = '';
if (uppercase) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
if (lowercase) pool += 'abcdefghijklmnopqrstuvwxyz';
if (numbers)   pool += '0123456789';
if (symbols)   pool += '!@#$%^&*()-_=+[]{}|;:,.<>?';

// Pick characters then Fisher-Yates shuffle for uniform distribution
const arr = Array.from({ length: len }, () => pool[ri(pool.length)]);
for (let i = arr.length - 1; i > 0; i--) {
  const j = ri(i + 1);
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
return arr.join('');
```

### Generator options

**🔑 Password**
```
Length     ──────────●──── 16   (range: 8 to 64)
☑ Uppercase A–Z
☑ Lowercase a–z
☑ Numbers 0–9
☑ Symbols ! @ # $ …
☐ Exclude ambiguous  (0 O 1 l I)

Output:  4c^;M6:;Odu;MQGZ
```

**💬 Passphrase**
```
Word count ────●───────── 4   (range: 3 to 8)
Separator  -
☑ Capitalize words
☑ Append number

Output:  Node-Cyber-Nova-Echo-86
```

**👤 Username**
```
Style:  Adjective + Noun  →  rapid_ghost14
        Word + Number     →  maple4821
        Random            →  k3xm9qp2r
```

---

## ⚡ Autofill System

### Detection

The content script runs on every page and listens for a `KN_DETECT` message from the popup:

```javascript
function findLoginFields() {
  const pw = document.querySelector('input[type="password"]');
  if (!pw) return null;
  const scope = pw.closest('form') || document;
  const user  = scope.querySelector('input[type="email"]')
             || scope.querySelector('input[name*="user" i]')
             || scope.querySelector('input[name*="email" i]')
             || scope.querySelector('input[type="text"]');
  return { user, pw };
}
```

### Filling (React / Vue / Angular compatible)

```javascript
function fillField(el, value) {
  // Use native setter to trigger framework onChange events
  const desc = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype, 'value'
  );
  if (desc && desc.set) desc.set.call(el, value);
  else el.value = value;

  el.dispatchEvent(new Event('input',  { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}
```

### Site matching

An entry matches the current page if the entry's `url` field contains the current hostname, or the hostname contains the entry's URL. Saving `github.com` matches `github.com/login`, `gist.github.com`, etc.

---

## 🔭 Future Scope

| Feature | Description |
|---|---|
| 🦊 **Firefox Extension** | Port to Firefox using the WebExtensions API |
| 📱 **Mobile App** | React Native for iOS/Android with same AES-256 local encryption |
| 🔢 **TOTP / 2FA** | Built-in one-time password generation (like Google Authenticator) |
| 🛡️ **Breach Detection** | HaveIBeenPwned API integration to alert about compromised passwords |
| 👆 **Biometric Unlock** | WebAuthn fingerprint and Face ID unlock support |
| 📊 **Vault Health Dashboard** | Identify weak, reused, and old passwords |
| 📥 **Import / Export** | Migrate from Chrome, Firefox, Bitwarden, LastPass CSV formats |
| 🚨 **Emergency Access** | Trusted contact can request vault access after a delay |
| 💻 **CLI Tool** | Command-line interface for developer access to vault credentials |

---

## 🎓 Academic Details

| Field | Details |
|---|---|
| **Project Title** | KeyNova — Secure Password Manager Chrome Extension |
| **Student Name** | Pirathpal Kaur |
| **Roll Number** | UniRollNo: 217710 |
| **Programme** | Master of Computer Applications (MCA) — 4th Semester |
| **Batch** | 2023 – 2025 |
| **Institution** | Yadavindra Department of Engineering, Talwandi Sabo |
| **Academic Guide** | Dr. Manoj Kumar — Assist. Prof., Dept. of Computer Science |
| **Co-Guide** | Ms. Rupinder Kaur |
| **External Guide** | Ms. Neha |
| **Industry Partner** | Softwizz Technologies Pvt. Ltd. |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

**Steps to contribute:**

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/YourFeatureName

# 3. Make your changes
# 4. Commit with a clear message
git commit -m "Add: your feature description"

# 5. Push to your branch
git push origin feature/YourFeatureName

# 6. Open a Pull Request
```

**Coding guidelines:**
- ❌ No external npm packages in the extension — keep it dependency-free
- ❌ Never use `Math.random()` — always `crypto.getRandomValues()`
- ❌ Never log passwords or keys to the console
- ✅ All crypto operations must use Web Crypto API only
- ✅ Test autofill on at least 3 websites before submitting a PR
- ✅ Keep popup.js sections clearly separated with comment headers

---

## 📚 References

1. [Google Chrome — Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)
2. [W3C Web Cryptography API Specification](https://www.w3.org/TR/WebCryptoAPI/)
3. [MDN — SubtleCrypto Interface](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
4. [NIST SP 800-132 — PBKDF Recommendation](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)
5. [RFC 2898 — Password-Based Cryptography](https://datatracker.ietf.org/doc/html/rfc2898)
6. [Firebase Documentation](https://firebase.google.com/docs)
7. [Bitwarden Security White Paper](https://bitwarden.com/images/resources/security-white-paper-download.pdf)

---

## 📄 License

```
MIT License

Copyright (c) 2025 Pirathpal Kaur

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

**Made with 🔐 by Pirathpal Kaur**

*Yadavindra Department of Engineering, Talwandi Sabo*

*Softwizz Technologies Pvt. Ltd. — 2023–2025*

<br/>

---

*"Security is not a feature — it is a foundation."*

<br/>

⭐ **Star this repo if KeyNova helped you!** ⭐

<br/>

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/keynova?style=social)](https://github.com/YOUR_USERNAME/keynova)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/keynova?style=social)](https://github.com/YOUR_USERNAME/keynova/fork)

</div>
