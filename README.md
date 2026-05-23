# example-fullstack-ts

Small W7S example with a bundled Hono backend and a built React frontend.

## What It Deploys

- `backend/src/index.ts`: Hono Worker source.
- `backend/index.js`: generated backend bundle deployed by W7S.
- `frontend/src`: React frontend source.
- `frontend/dist`: generated static frontend served before backend fallback.
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

If your repo is:

```text
github.com/sadasant/example-fullstack-ts
```

the W7S URL is:

```text
https://sadasant.w7s.cloud/example-fullstack-ts/
```

## Custom Domain

Add `frontend/CNAME` with one hostname:

```text
app.example.com
```

Deploy again, then create a proxied DNS `CNAME` for that hostname pointing to:

```text
w7s.cloud
```
