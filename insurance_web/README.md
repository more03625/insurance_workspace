# Insurance Web (Frontend)

React application built with Vite and Tailwind CSS.

## Setup

```bash
cd insurance_web
npm install
```

## Run

```bash
npm run dev
```

Runs at http://localhost:3000. API requests to `/api` are proxied to the backend at `http://localhost:8000`.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Project Structure

```
insurance_web/src/
├── components/      # Reusable UI (Layout, Sidebar, ProtectedRoute, FormField)
├── pages/
│   ├── portal/      # Policyholder pages (Dashboard, MyClaims, MyPolicies)
│   └── *.jsx        # Admin pages (Dashboard, Claims, Surveyor, Policies, Users)
├── services/        # API service layer (Axios)
├── context/         # AuthContext (login/logout, session persistence)
├── constants/       # API endpoints & enums
├── hooks/           # Custom hooks (useApi)
└── App.jsx          # Route definitions
```

## Role-Based Access

| Route      | Access              |
|------------|---------------------|
| `/login`   | Public              |
| `/admin/*` | Employee / Admin    |
| `/portal/*`| Policyholder        |

## Deploy to Netlify

1. Create a new site from Git on Netlify
2. Set **Base directory** to `insurance_web`
3. Build command and publish directory are auto-read from `netlify.toml`
4. After deploying the backend, update the API proxy URL in `netlify.toml`:
   ```
   to = "https://your-render-service.onrender.com/:splat"
   ```
