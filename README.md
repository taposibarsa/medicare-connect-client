# MediCare Connect — Client

Next.js frontend for MediCare Connect.

**Full documentation:** see the [root README](../README.md).

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:3000`. Requires the Express server at `NEXT_PUBLIC_API_URL`.

## Key Features

- Better Auth (email + Google OAuth)
- Role-based dashboards (patient, doctor, admin)
- Stripe hosted checkout
- Sonner toast notifications
- Dark/light theme toggle
- Doctor availability calendar on booking
- Card/table toggle on Find Doctors

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production build |
