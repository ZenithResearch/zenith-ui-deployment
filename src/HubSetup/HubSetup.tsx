"use client";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import "./HubSetup.css";
export type HermesEntryState =
  | "install"
  | "configure"
  | "recover"
  | "checking"
  | "unavailable";

const hermesEntryLabels: Record<HermesEntryState, string> = {
  install: "Install Hermes",
  configure: "Continue",
  recover: "Review Hermes setup",
  checking: "Checking Hermes…",
  unavailable: "Setup unavailable",
};

export function HermesSetupLanding({
  state,
  onContinue,
  onConfigure,
  configuration,
  onCloseConfiguration,
  configurationBusy = false,
  continueDisabled = false,
}: {
  state: HermesEntryState;
  onContinue: () => void;
  onConfigure?: () => void;
  configuration?: ReactNode;
  onCloseConfiguration?: () => void;
  configurationBusy?: boolean;
  continueDisabled?: boolean;
}) {
  const pending = state === "checking" || state === "unavailable";
  const dialog = useRef<HTMLDialogElement>(null);
  const configurationOpen = Boolean(configuration);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (configurationOpen && !node.open) node.showModal();
    if (!configurationOpen && node.open) node.close();
    return () => { if (node.open) node.close(); };
  }, [configurationOpen]);
  return (
    <main className="zn-hermes-landing">
      <h1>Hermes</h1>
      <div className="zn-hermes-landing__action" aria-live="polite">
        <button type="button" disabled={pending || continueDisabled} onClick={onContinue}>
          {hermesEntryLabels[state]}
        </button>
        {(state === "configure" || configurationOpen) && onConfigure && (
          <button
            type="button"
            className="zn-hermes-landing__configure"
            disabled={pending}
            onClick={onConfigure}
          >
            Configure
          </button>
        )}
      </div>
      <dialog
        ref={dialog}
        className="zn-hermes-landing__configuration"
        aria-labelledby="hermes-configuration-title"
        onCancel={(event) => {
          event.preventDefault();
          if (!configurationBusy) onCloseConfiguration?.();
        }}
      >
        <div className="zn-hermes-landing__configuration-heading">
          <h2 id="hermes-configuration-title">Configure Hermes</h2>
          <button
            type="button"
            disabled={configurationBusy}
            aria-label="Close Hermes configuration"
            onClick={onCloseConfiguration}
          >
            Close
          </button>
        </div>
        <div className="zn-setup zn-hermes-landing__configuration-body">
          {configuration}
        </div>
      </dialog>
    </main>
  );
}

export type SetupStep =
  "welcome" | "communications" | "components" | "review" | "environment";
export const setupSteps: { id: SetupStep; label: string }[] = [
  { id: "welcome", label: "Welcome" },
  { id: "communications", label: "Communications" },
  { id: "components", label: "Components" },
  { id: "review", label: "Review setup" },
  { id: "environment", label: "Your environment" },
];
export function SetupShell({
  step,
  onStep,
  children,
  busy,
  freshness,
  error,
}: {
  step: SetupStep;
  onStep: (step: SetupStep) => void;
  children: ReactNode;
  busy: boolean;
  freshness: string;
  error?: string;
}) {
  return (
    <div className="zn-setup">
      <a className="zn-setup__skip" href="#setup-main">
        Skip to setup
      </a>
      <aside>
        <a
          className="zn-setup__brand"
          href="#welcome"
          onClick={() => onStep("welcome")}
        >
          Z <span>Zenith Hub</span>
        </a>
        <nav aria-label="Setup steps">
          {setupSteps.map((s, n) => (
            <button
              key={s.id}
              type="button"
              aria-current={s.id === step ? "step" : undefined}
              disabled={busy}
              onClick={() => onStep(s.id)}
            >
              <span>{n + 1}</span>
              {s.label}
            </button>
          ))}
        </nav>
        <p>
          Your services. Your data.
          <br />
          Choose what belongs here.
        </p>
      </aside>
      <main id="setup-main">
        <header>
          <span>YOUR LOCAL HUB</span>
          <span role="status">{freshness}</span>
        </header>
        {error && (
          <div role="alert" className="zn-setup__error">
            {error}
          </div>
        )}
        {children}
        <footer>
          Deployment actions always require a reviewed plan. Chat advice does
          not apply changes.
        </footer>
      </main>
    </div>
  );
}
export function SetupIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="zn-setup__intro">
      {eyebrow && <span className="zn-setup__eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {children}
    </div>
  );
}
export function SetupPanel({
  title,
  children,
  aside,
}: {
  title: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="zn-setup__panel">
      <div className="zn-setup__heading">
        <h2>{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
export function ComponentChoice({
  name,
  description,
  selected,
  onSelect,
  children,
}: {
  name: string;
  description: string;
  selected: boolean;
  onSelect: (value: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <section className={"zn-setup__choice" + (selected ? " is-selected" : "")}>
      <label className="zn-setup__choice-label">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
        />
        <span>
          <strong>{name}</strong>
          <small>{description}</small>
        </span>
        <span className="zn-setup__badge">
          {selected ? "Selected" : "Available"}
        </span>
      </label>
      {selected && <div className="zn-setup__choice-content">{children}</div>}
    </section>
  );
}
export type ConnectionListItem = {
  id: string;
  name: string;
  endpoint: string;
  status: string;
  detail?: string;
  action?: "choose" | "manage";
};
export function ConnectionList({ items, disabled, onChoose, onManage }: {
  items: ConnectionListItem[];
  disabled: boolean;
  onChoose: (item: ConnectionListItem) => void;
  onManage: (item: ConnectionListItem) => void;
}) {
  return (
    <ul className="zn-setup__connections" aria-label="Service connections">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            <strong>{item.name}</strong>
            <span className="zn-setup__connection-endpoint">{item.endpoint}</span>
            {item.detail && <small>{item.detail}</small>}
          </div>
          <span className="zn-setup__badge">{item.status}</span>
          {item.action === "choose" && <button type="button" disabled={disabled} onClick={() => onChoose(item)}>Choose this connection</button>}
          {item.action === "manage" && <button type="button" disabled={disabled} onClick={() => onManage(item)}>Manage connection</button>}
        </li>
      ))}
    </ul>
  );
}
export function StateFacts({
  facts,
}: {
  facts: { label: string; value: string }[];
}) {
  return (
    <dl className="zn-setup__facts">
      {facts.map((f) => (
        <div key={f.label}>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
export function SourceDetails({
  repository,
  revision,
  schema,
  children,
}: {
  repository: string;
  revision: string;
  schema?: unknown;
  children?: ReactNode;
}) {
  return (
    <details className="zn-setup__details">
      <summary>Source, schema and dependencies</summary>
      <p>
        <a
          href={"https://github.com/" + repository}
          target="_blank"
          rel="noreferrer"
        >
          {repository}
        </a>
        <br />
        <code>{revision}</code>
      </p>
      {children}
      {schema !== undefined && (
        <details>
          <summary>Configuration schema</summary>
          <pre>{JSON.stringify(schema, null, 2)}</pre>
        </details>
      )}
    </details>
  );
}
export function GuideChat({
  available,
  busy,
  onSend,
  status,
}: {
  available: boolean;
  busy: boolean;
  onSend: (text: string) => Promise<string>;
  status: string;
}) {
  const [message, setMessage] = useState(""),
    [turns, setTurns] = useState<{ role: string; text: string }[]>([]),
    [sending, setSending] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = message.trim();
    if (!text || sending) return;
    setMessage("");
    setTurns((t) => [...t, { role: "You", text }]);
    setSending(true);
    try {
      const reply = await onSend(text);
      setTurns((t) => [...t, { role: "Hermes", text: reply }]);
    } catch {
      setTurns((t) => [
        ...t,
        {
          role: "Connection",
          text: "Hermes could not answer. Check its model backend and connection; no deployment action was applied.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }
  return (
    <SetupPanel title="Ask Hermes">
      <p>{status}</p>
      <div className="zn-setup__conversation" role="log" aria-live="polite">
        {turns.map((t, n) => (
          <div key={n}>
            <strong>{t.role}</strong>
            <p>{t.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit}>
        <label>
          Your setup question
          <textarea
            rows={2}
            maxLength={4000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!available || busy || sending}
          />
        </label>
        <button
          className="zn-setup__primary"
          disabled={!available || !message.trim() || busy || sending}
        >
          {sending ? "Waiting for Hermes…" : "Ask Hermes"}
        </button>
      </form>
      <details>
        <summary>Setup help available offline</summary>
        <p>
          Connect a local Hermes API to use agent chat. The agent process and
          its model backend are separate: a local process may use a remote
          model. Matrix is optional and can be configured later.
        </p>
        <p>
          Install adds software. Configure creates its local settings. Start
          launches the selected service. Connecting an existing service grants
          no process control.
        </p>
      </details>
    </SetupPanel>
  );
}
export function PlanReview({
  title,
  children,
  onApply,
  onCancel,
  busy,
  blocked,
}: {
  title: string;
  children: ReactNode;
  onApply: () => void;
  onCancel: () => void;
  busy: boolean;
  blocked: boolean;
}) {
  return (
    <SetupPanel title={title}>
      <div className="zn-setup__review">{children}</div>
      <div className="zn-setup__actions">
        <button type="button" disabled={busy} onClick={onCancel}>
          Cancel review
        </button>
        <button
          className="zn-setup__primary"
          type="button"
          disabled={busy || blocked}
          onClick={onApply}
        >
          {busy ? "Applying…" : "Apply reviewed plan"}
        </button>
      </div>
      {blocked && (
        <p>Complete the listed prerequisites, then create a new review.</p>
      )}
    </SetupPanel>
  );
}
