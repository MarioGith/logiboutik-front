# Logiboutik — front-end

Logiboutik is a lightweight stock and invoice app for small businesses that
sell through partner shops. This repository is the Next.js front-end; the API
lives in [logiboutik-back](https://github.com/MarioGith/logiboutik-back).

## Features

- Shops, articles and transactions (deposit, sale, retrieval)
- Current stock computed from the transactions, printable stock sheet (PDF)
- Monthly invoice (PDF) from the sales of a period
- Company details and clients, saved in the browser (localStorage)
- One-click JSON backup of the whole database

## Run locally

```bash
cp .env.example .env     # SERVER_BASE_URL = address of the API
pnpm install
pnpm dev                 # http://localhost:3000
```

| Command       | What it does        |
| ------------- | ------------------- |
| `pnpm dev`    | Development server  |
| `pnpm build`  | Production build    |
| `pnpm lint`   | ESLint              |
| `pnpm test`   | Unit tests (vitest) |
| `pnpm format` | Prettier            |

`SERVER_BASE_URL` is read at **build** time. For the Docker image, pass it as
a build argument (`docker build --build-arg SERVER_BASE_URL=...`); without it
the app calls `http://localhost:8082`.

## Code layout

```
pages/          one file per screen (Next.js pages router)
components/     Header, List (table + search), Button, forms shared by
                the create and edit pages (ArticleForm, TransactionForm)
context/        company details and clients (localStorage)
services/       API calls (axios)
utils/          formatting, invoice maths, PDF building, toasts, i18n
public/locales/ French texts, one JSON file per screen + common.json
styles/         theme.scss (all colors and sizes) + global.scss
```

Conventions:

- Every visible text comes from `public/locales/fr/*.json`.
- Every color comes from the variables in `styles/theme.scss`.
- API errors are shown with `notifyError(err, t)`: the API sends a `code`
  that is translated through `errors.*` in `common.json`.

## Deployment

Pushing to `main` builds and publishes the `logiboutik-front:latest` Docker
image. Pull requests and `dev` only build it.
