# Live M-Pesa Deployment Checklist

Use this guide to move from local demo mode to real live debit.

## 1) Deploy Backend To A Public Network

Recommended: deploy `backend/` to a public runtime (Render, Railway, Fly.io, Azure App Service, VPS).

Minimum requirements:
- Public HTTPS base URL (for example, `https://api.yourdomain.com`)
- Outbound access to Safaricom Daraja endpoints
- Node 18+ runtime

## 2) Set Production Environment Variables

Required:
- `NODE_ENV=production`
- `PORT=5000` (or platform-provided port)
- `MONGODB_URI=...`
- `CLIENT_URL=https://your-frontend-domain.com`
- `MPESA_ENV=sandbox` or `MPESA_ENV=production`
- `MPESA_CONSUMER_KEY=...`
- `MPESA_CONSUMER_SECRET=...`
- `MPESA_SHORTCODE=...`
- `MPESA_PASSKEY=...`
- `MPESA_CALLBACK_URL=https://api.yourdomain.com/api/donations/mobile-money/callback`
- `MPESA_SIMULATION_MODE=false`

Important:
- In production, simulation is forced OFF even if accidentally set to true.
- Callback URL must be HTTPS and publicly reachable.

## 3) Update Frontend API Base URL

Set frontend env:
- `VITE_API_BASE_URL=https://api.yourdomain.com`

Then rebuild/redeploy frontend.

## 4) Verify Live Readiness

From backend folder:

```bash
npm run check:mpesa
```

Or point to deployed backend:

```bash
BACKEND_BASE_URL=https://api.yourdomain.com npm run check:mpesa
```

Expected for live debit:
- `PASS: Credentials configured`
- `PASS: HTTPS callback URL configured`
- `PASS: Simulation mode is OFF`
- `PASS: Gateway token request succeeded`
- Final output: `READY: Live M-Pesa debit is enabled.`

## 5) If Token Check Fails

If you see edge/security blocking messages:
- Run backend from a different public host/network (current egress IP may be blocked).
- Reconfirm Daraja app key/secret pair and environment (sandbox vs production).
- Regenerate keys in Daraja portal if needed.
- Retry readiness check.

## 6) Operational Safety

- Keep simulation enabled only for local demos/non-production.
- Keep strict mode in production.
- Rotate Daraja credentials if they were shared or exposed.
