# CaRent

A car rental listing board. Car owners post vehicles for rent, and renters browse what is available and message the owner. The flow is meant to feel familiar to people who use Facebook Marketplace.

CaRent does **not** handle payments or bookings. Owner and renter chat in the app and decide the rest between themselves.

## Features

| Feature | Who can use it |
|---|---|
| Browse, search, and filter car listings | Everyone (guests too) |
| View listing details | Everyone |
| Register, log in, log out | Everyone |
| Post, edit, delete, and mark a car as rented or available | Logged-in users (on their own listings) |
| Chat with a car owner ("Is this still available?") | Logged-in users |
| Rate a listing (1 to 5 stars + comment) | Logged-in users who chatted with the owner |
| Save listings | Logged-in users |

**Roles:** Guest and Registered User. There is no separate owner or renter account. A user is the "owner" of any listing that has their ID.

## Tech Stack

- **Frontend:** React (Vite), React Router
- **Backend:** Firebase Authentication, Cloud Firestore
- **Styling:** External CSS 
- **Icons:** react-icons
- **Hosting:** Firebase Hosting

## Prerequisites

Install these before you start:

1. **Node.js 20.19+ or 22.12+** (LTS). Check with `node -v`. Download at https://nodejs.org
2. **Git**. Check with `git --version`. Download at https://git-scm.com
3. **VS Code** with these extensions:
   - ESLint
   - Prettier
   - ES7+ React/Redux Snippets
4. A **GitHub account**, added as a collaborator on the repo.
5. A **Google account** with access to the Firebase project (ask the team lead to add you).

## Getting Started

```bash
# 1. Clone the repo
git clone <https://github.com/leerayvenc-bot/CaRent>
cd <CaRent>

# 2. Install dependencies
npm install

# 3. Create your .env file (see next section)
cp .env.example .env        # on Windows PowerShell: Copy-Item .env.example .env

# 4. Start the dev server
npm run dev
```


### Environment variables

Open `.env` and fill in the Firebase values. Ask the team lead for them, or copy them from the Firebase console under **Project settings, Your apps, SDK setup and configuration, Config**.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- Paste values with no quotes.
- Every name must start with `VITE_`, or Vite will not load it.
- **Never commit `.env`.** It is listed in `.gitignore`. Only `.env.example` (names, no values) goes to GitHub.
- Vite reads `.env` only at startup. **Restart `npm run dev` after any change.**

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code with ESLint |


## Project Structure

```
src/
├── assets/images/     Logos, hero images, placeholders
├── components/        Reusable UI pieces (display only)
│   ├── common/        Button, Input, Modal, Badge, Spinner...
│   ├── layout/        Navbar, Footer
│   ├── cars/          CarCard, CarGrid, CarFilters, CarForm
│   ├── chat/          ConversationList, ChatWindow, MessageBubble
│   └── ratings/       RatingList, RatingForm
├── config/            Firebase setup
├── constants/         Route paths, car status values
├── context/           AuthContext, AuthProvider
├── hooks/             useAuth and other logic hooks
├── pages/             One folder per screen
├── routes/            AppRouter, ProtectedRoute
├── services/          The only code that talks to Firebase
├── styles/            Global CSS: reset, variables, global
└── utils/             Validators, formatters
```

Each component lives in its own folder with a `.jsx` file and a `.module.css` file.

## Architecture Rules

We follow abstraction, modularity, encapsulation, separation of concerns, information hiding, high cohesion, and low coupling. In practice:

1. Dependencies run one way: **Page, then Hook, then Service, then Firebase.** Never skip a layer.
2. **Only `services/` and `config/firebase.js` import Firebase.** Components, hooks, and pages never do.
3. **Components get data and callbacks through props.** They do not import services.
4. **No hardcoded colors or status strings.** Use CSS variables from `styles/variables.css` and values from `constants/`.
5. **One component per folder**, with its own `.module.css`.
6. **Services return plain objects** and friendly error messages, never raw Firebase types or error codes.
7. Each file does one job.

## Design Palette

| Use | Color |
|---|---|
| Main background | `#EBE9E1` |
| Main text | `#ED3D12` |
| Buttons and highlights | `#EFB11D` |
| Soft accent | `#FFA2B6` |
| Secondary accent | `#D6536D` |

All colors live in `src/styles/variables.css`. Use the variables, not the hex values.

## Git Workflow

1. **Pull before you start:** `git pull`
2. **Work on your own branch:** `git checkout -b feature/<short-name>` 
3. **Commit small and often** with a clear message: `git commit -m "Add CarCard component"`
4. **Push your branch** and open a **Pull Request** into `main`. Another teammate reviews it before merging.
5. **Do not push directly to `main`.**
6. **Never commit `.env`** or any secret keys. Check Source Control before you commit.

Empty folders are kept with a `.gitkeep` file. You can delete the `.gitkeep` once the folder has real files.

## Progress

**Done**
- Project setup (Vite + React), folder structure, Firebase config
- Route and car status constants, form validators
- `authService`, `AuthProvider`, `useAuth`
- `ProtectedRoute` and `Spinner`
- Chat and Inbox UI (live Firestore chat backend)

**Next**
- `AppRouter`, Login and Register pages
- Browse page, car listings (create, read, update, delete)
- Ratings
- Listing photos (storage decision)
- Deployment to Firebase Hosting

## Troubleshooting

| Problem | Fix |
|---|---|
| Firebase values are `undefined` | Check the `.env` names start with `VITE_`, the file is in the project root, and restart `npm run dev`. |
| `Missing or insufficient permissions` | Firestore rules are not published, or you are not logged in. |
| `auth/operation-not-allowed` | Email/Password sign-in is not enabled in the Firebase console. |
| `git commit` says `gpg failed to sign the data` | Run `git config --local commit.gpgsign false` |
| Changes do not appear when you run a test | Save all files (File, Auto Save). |
| Styles import error on startup | Make sure `reset.css`, `variables.css`, and `global.css` exist in `src/styles/`. |


## Course

CPEPE361 FINAL PROJECT, CIT-U.