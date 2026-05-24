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

## How The W7S Action Works

The deploy workflow uses `w7s-io/w7s-cloud@v1`:

```yaml
- name: Deploy
  uses: w7s-io/w7s-cloud@v1
  with:
    token: ${{ github.token }}
    install-command: npm ci
    build-command: npm run build
```

The action runs the install and build commands, zips the repository, and sends it to the W7S deploy API. W7S verifies the deploy with the repository's GitHub token, publishes `backend/index.js` as the Worker backend, publishes `frontend/dist` as static assets, and attaches the hostname from `frontend/CNAME`.

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
