# THAR SOLAR API (MVC)

```
server/
├── index.js
├── app.js
├── seed.js
├── data/          # Self-contained seed catalog (no client import)
├── config/
├── models/
├── controllers/
├── routes/
├── middleware/
├── services/
└── utils/
```

## Run

From repo root:

```bash
npm run install:all
npm run dev:server
```

Or from this folder:

```bash
npm install
npm run dev
```

- Health: http://127.0.0.1:4000/api/health  
- Env: repo root `.env` or `server/.env` (see `.env.example`)
