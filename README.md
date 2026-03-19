# 24/7 Towing Website

Multi-location towing and roadside assistance lead-generation site built with React, TypeScript, Vite, and MUI.

## Stack

- React 19 + TypeScript
- Vite 7
- MUI 7
- Cloudflare Pages Functions for `/api/submit-lead`
- Twilio SMS alerts from the serverless function

## Local Development

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Build

```bash
npm run build
```

## Local Cloudflare Function Testing

To test the Cloudflare Pages Function (`functions/api/submit-lead.js`) locally:

```bash
npm run cf:dev
```

This builds the app and serves `dist` with Pages Functions enabled.

## Cloudflare Pages Deployment

Create a Cloudflare Pages project connected to this repo and use:

- Build command: `npm run build`
- Build output directory: `dist`

### Required Environment Variables

Set these in Cloudflare Pages for both Preview and Production.

Public (build-time) vars:
- `VITE_SITE_NAME`
- `VITE_ENABLE_API`
- `VITE_RECAPTCHA_SITE_KEY` (optional)
- `VITE_GA_MEASUREMENT_ID` (optional)
- Any other `VITE_*` variables your branding uses

Secret vars for serverless function:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM`
- `ALERT_TO`
- `RECAPTCHA_SECRET` (optional)

## API Route

- `POST /api/submit-lead` is handled by Cloudflare at `functions/api/submit-lead.js`.
- Frontend submissions are centralized in `src/services/leadSubmit.ts`.
