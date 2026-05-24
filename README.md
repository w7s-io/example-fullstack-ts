# example-fullstack-ts

Small W7S example with a bundled Hono backend and a built React frontend.

## What It Deploys

- `backend/src/index.ts`: Hono Worker source.
- `backend/index.js`: generated backend bundle deployed by W7S.
- `frontend/src`: React frontend source.
- `frontend/dist`: generated static frontend served before backend fallback.
- `frontend/CNAME`: custom-domain claim for `fullstack-example.w7s.io`.
- `.github/workflows/deploy.yml`: deploys this repo with `w7s-io/w7s-cloud@v1`.

Generated deploy artifacts are ignored by git. The GitHub Actions workflow runs:

```sh
npm ci
npm run build
```

before uploading the repo archive to W7S.

## Local Commands

```sh
npm install
npm run check
npm run dev
```

## Deploy

Fork or copy this repo into your GitHub account or org, enable GitHub Actions, and push to `main`.

This repo deploys to:

```text
https://w7s-io.w7s.cloud/example-fullstack-ts/
```

and claims this custom domain:

```text
https://fullstack-example.w7s.io/
```

## Custom Domain

This repo includes `frontend/CNAME` with one hostname:

```text
fullstack-example.w7s.io
```

Create a proxied DNS `CNAME` for that hostname pointing to:

```text
w7s.cloud
```

W7S will warn until the optional TXT allowlist is added:

```text
_w7s.w7s.io = w7s-io/example-fullstack-ts
```
