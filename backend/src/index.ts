import { Hono } from "hono";

type EchoBody = {
  note?: string;
  source?: string;
};

const app = new Hono();

app.get("/api/hello", (c) =>
  c.json({
    message: "Hello from a bundled Hono backend.",
    runtime: "cloudflare-workers-for-platforms",
    framework: "hono",
    deployedBy: "example-fullstack-ts",
    context: {
      org: c.req.header("x-w7s-org-slug") ?? null,
      repo: c.req.header("x-w7s-repo-slug") ?? null,
      originalPath: c.req.header("x-w7s-original-path") ?? null
    }
  })
);

app.get("/api/time", (c) =>
  c.json({
    now: new Date().toISOString(),
    timezone: "UTC"
  })
);

app.get("/api/status", (c) =>
  c.json({
    service: "example-fullstack-ts",
    status: "healthy",
    checks: [
      { name: "hono-router", status: "ok" },
      { name: "worker-dispatch", status: "ok" },
      { name: "static-assets", status: "ok" }
    ]
  })
);

app.post("/api/echo", async (c) => {
  let body: EchoBody | string | null = null;
  try {
    body = await c.req.json<EchoBody>();
  } catch {
    body = await c.req.text();
  }

  return c.json({
    echoed: body,
    receivedAt: new Date().toISOString()
  });
});

app.notFound((c) =>
  c.json(
    {
      error: "Not found",
      method: c.req.method,
      path: new URL(c.req.url).pathname
    },
    404
  )
);

export default app;
