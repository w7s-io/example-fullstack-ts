import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Clock3,
  RefreshCw,
  Send,
  Server,
  ShieldCheck
} from "lucide-react";
import "./styles.css";

type ApiResult = {
  endpoint: string;
  status: number;
  payload: unknown;
};

const apiUrl = (path: string) => new URL(path, window.location.href).toString();

const fetchJson = async (path: string, init?: RequestInit): Promise<ApiResult> => {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.headers ?? {})
    }
  });
  const text = await response.text();
  let payload: unknown = text;
  try {
    payload = JSON.parse(text);
  } catch {}
  return {
    endpoint: path,
    status: response.status,
    payload
  };
};

function App() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commands = useMemo(
    () => [
      {
        id: "hello",
        label: "Backend",
        icon: Server,
        run: () => fetchJson("api/hello")
      },
      {
        id: "time",
        label: "Clock",
        icon: Clock3,
        run: () => fetchJson("api/time")
      },
      {
        id: "status",
        label: "Status",
        icon: ShieldCheck,
        run: () => fetchJson("api/status")
      },
      {
        id: "echo",
        label: "Echo",
        icon: Send,
        run: () =>
          fetchJson("api/echo", {
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({
              note: "React frontend calling a Hono backend through W7S.",
              source: window.location.pathname
            })
          })
      }
    ],
    []
  );

  const runCommand = async (command: (typeof commands)[number]) => {
    setLoading(command.id);
    setError(null);
    try {
      setResult(await command.run());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    void runCommand(commands[0]);
  }, [commands]);

  return (
    <main className="shell">
      <section className="summary">
        <p className="eyebrow">W7S example</p>
        <h1>React frontend. Hono backend. One GitHub deploy.</h1>
        <p className="lede">
          This app builds a bundled Worker backend and a Vite React frontend before the W7S deployment package is uploaded.
        </p>
        <div className="stats" aria-label="Deployment shape">
          <div>
            <span>Backend</span>
            <strong>Hono Worker</strong>
          </div>
          <div>
            <span>Frontend</span>
            <strong>React + Vite</strong>
          </div>
          <div>
            <span>Deploy</span>
            <strong>GitHub Actions</strong>
          </div>
        </div>
      </section>

      <section className="workspace" aria-label="API console">
        <div className="toolbar">
          {commands.map((command) => {
            const Icon = command.icon;
            const busy = loading === command.id;
            return (
              <button
                key={command.id}
                type="button"
                onClick={() => void runCommand(command)}
                disabled={Boolean(loading)}
                title={`Call ${command.label}`}
              >
                {busy ? <RefreshCw className="spin" size={16} /> : <Icon size={16} />}
                <span>{command.label}</span>
              </button>
            );
          })}
        </div>

        <div className="response">
          <div className="responseHeader">
            <div>
              <span>Endpoint</span>
              <strong>{result?.endpoint ?? "api/hello"}</strong>
            </div>
            <div className="statusBadge">
              <Activity size={14} />
              {loading ? "loading" : error ? "error" : result ? result.status : "idle"}
            </div>
          </div>
          <pre>{error ?? JSON.stringify(result?.payload ?? { status: "Loading initial backend response..." }, null, 2)}</pre>
        </div>
      </section>
    </main>
  );
}

createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
