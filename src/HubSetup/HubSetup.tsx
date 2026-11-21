"use client";
import React, {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  continueLabel,
  unavailableReason,
  onRetry,
}: {
  state: HermesEntryState;
  onContinue: () => void;
  onConfigure?: () => void;
  configuration?: ReactNode;
  onCloseConfiguration?: () => void;
  configurationBusy?: boolean;
  continueDisabled?: boolean;
  continueLabel?: string;
  unavailableReason?: string;
  onRetry?: () => void;
}) {
  const pending = state === "checking" || state === "unavailable";
  const dialog = useRef<HTMLDialogElement>(null);
  const configurationOpen = Boolean(configuration);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (configurationOpen && !node.open) node.showModal();
    if (!configurationOpen && node.open) node.close();
    return () => {
      if (node.open) node.close();
    };
  }, [configurationOpen]);
  return (
    <main className="zn-hermes-landing">
      <h1>Hermes</h1>
      <div className="zn-hermes-landing__action" aria-live="polite">
        <button
          type="button"
          disabled={pending || continueDisabled}
          onClick={onContinue}
        >
          {state === "configure" && continueLabel
            ? continueLabel
            : hermesEntryLabels[state]}
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
        {state === "unavailable" && (
          <div className="zn-hermes-landing__recovery" role="alert">
            <p>
              {unavailableReason ||
                "The setup controller could not be reached. Try checking again."}
            </p>
            {onRetry && (
              <button type="button" onClick={onRetry}>
                Retry setup check
              </button>
            )}
          </div>
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
  | "welcome"
  | "communications"
  | "components"
  | "review"
  | "environment";
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
export function ConnectionList({
  items,
  disabled,
  onChoose,
  onManage,
}: {
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
            <span className="zn-setup__connection-endpoint">
              {item.endpoint}
            </span>
            {item.detail && <small>{item.detail}</small>}
          </div>
          <span className="zn-setup__badge">{item.status}</span>
          {item.action === "choose" && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChoose(item)}
            >
              Choose this connection
            </button>
          )}
          {item.action === "manage" && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onManage(item)}
            >
              Manage connection
            </button>
          )}
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
export function HermesChatHud({
  children,
  connected,
  openSignal = 0,
  onSend,
  busy = false,
  status = "",
}: {
  children?: ReactNode;
  connected: boolean;
  openSignal?: number;
  onSend?: (message: string) => Promise<string>;
  busy?: boolean;
  status?: string;
}) {
  if (onSend)
    return (
      <HermesMessagePill
        available={connected}
        busy={busy}
        status={status}
        onSend={onSend}
        openSignal={openSignal}
      />
    );
  return (
    <LegacyHermesChatHud connected={connected} openSignal={openSignal}>
      {children}
    </LegacyHermesChatHud>
  );
}
function LegacyHermesChatHud({
  children,
  connected,
  openSignal = 0,
}: {
  children: ReactNode;
  connected: boolean;
  openSignal?: number;
}) {
  const [open, setOpen] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const hasOpened = useRef(false);
  useEffect(() => {
    if (openSignal > 0) setOpen(true);
  }, [openSignal]);
  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      const input = panel.current?.querySelector<HTMLTextAreaElement>(
        "textarea:not(:disabled)",
      );
      (input || panel.current)?.focus();
    } else if (hasOpened.current) launcher.current?.focus();
  }, [open]);
  return (
    <div className="zn-setup zn-hermes-hud">
      <button
        ref={launcher}
        type="button"
        className="zn-hermes-hud__launcher"
        hidden={open}
        aria-label="Open Hermes chat"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span
          aria-hidden="true"
          className={"zn-hermes-hud__dot" + (connected ? " is-connected" : "")}
        />
        <strong>Hermes</strong>
        <span>{connected ? "Chat" : "Setup help"}</span>
      </button>
      <section
        ref={panel}
        hidden={!open}
        tabIndex={-1}
        role="dialog"
        aria-modal="false"
        aria-label="Hermes chat"
        className="zn-hermes-hud__panel"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
          }
        }}
      >
        <div className="zn-hermes-hud__header">
          <h2>Hermes</h2>
          <button
            type="button"
            aria-label="Minimize Hermes chat"
            onClick={() => setOpen(false)}
          >
            Minimize
          </button>
        </div>
        <div className="zn-hermes-hud__body">{children}</div>
      </section>
    </div>
  );
}
function HermesMessagePill({
  available,
  busy,
  status,
  onSend,
  openSignal,
}: {
  available: boolean;
  busy: boolean;
  status: string;
  onSend: (message: string) => Promise<string>;
  openSignal: number;
}) {
  const [message, setMessage] = useState(""),
    [open, setOpen] = useState(false),
    [sending, setSending] = useState(false),
    [turns, setTurns] = useState<{ role: string; text: string }[]>([]);
  const input = useRef<HTMLInputElement>(null),
    mounted = useRef(true);
  const conversationId = useId();
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (openSignal > 0) {
      setOpen(true);
      input.current?.focus();
    }
  }, [openSignal]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || !available || busy || sending) return;
    setMessage("");
    setOpen(true);
    setSending(true);
    setTurns((current) => [...current, { role: "You", text }]);
    try {
      const reply = await onSend(text);
      if (mounted.current)
        setTurns((current) => [...current, { role: "Hermes", text: reply }]);
    } catch {
      if (mounted.current) {
        setTurns((current) => [
          ...current,
          {
            role: "Connection",
            text: "Hermes could not reply. Check the connection and try again.",
          },
        ]);
        setMessage((current) => current || text);
      }
    } finally {
      if (mounted.current) {
        setSending(false);
        input.current?.focus();
      }
    }
  }
  function minimize() {
    setOpen(false);
    input.current?.focus();
  }
  return (
    <div
      className="zn-setup zn-hermes-hud zn-hermes-hud--composer"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          minimize();
        }
      }}
    >
      <section
        id={conversationId}
        hidden={!open}
        role="region"
        aria-label="Hermes conversation"
        className="zn-hermes-hud__panel"
      >
        <div className="zn-hermes-hud__header">
          <h2>Hermes</h2>
          <button
            type="button"
            aria-label="Minimize Hermes conversation"
            onClick={minimize}
          >
            Minimize
          </button>
        </div>
        <div className="zn-hermes-hud__body">
          <p className="zn-hermes-hud__status" role="status">
            {status}
          </p>
          <div
            className="zn-setup__conversation"
            role="log"
            aria-live="polite"
            aria-label="Messages with Hermes"
          >
            {turns.map((turn, index) => (
              <div key={index}>
                <strong>{turn.role}</strong>
                <p>{turn.text}</p>
              </div>
            ))}
            {sending && <p role="status">Waiting for Hermes…</p>}
            {!turns.length && (
              <p>Type your message below to start a conversation.</p>
            )}
          </div>
        </div>
      </section>
      <form
        className="zn-hermes-hud__composer"
        onSubmit={submit}
        aria-label="Message Hermes"
      >
        <span
          aria-hidden="true"
          className={"zn-hermes-hud__dot" + (available ? " is-connected" : "")}
        />
        <input
          ref={input}
          type="text"
          aria-label="Message Hermes"
          placeholder="Ask Hermes…"
          maxLength={4000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.nativeEvent.isComposing)
              event.preventDefault();
          }}
          autoComplete="off"
        />
        <button
          type="button"
          className="zn-hermes-hud__history"
          aria-label={
            open ? "Hide Hermes conversation" : "Show Hermes conversation"
          }
          aria-expanded={open}
          aria-controls={conversationId}
          onClick={() => {
            setOpen((current) => !current);
            input.current?.focus();
          }}
        >
          ⌃
        </button>
        <button
          type="submit"
          className="zn-hermes-hud__send"
          aria-label="Send message to Hermes"
          disabled={!available || busy || sending || !message.trim()}
        >
          {sending ? "…" : "↑"}
        </button>
      </form>
    </div>
  );
}
export function GuideChat({
  available,
  busy,
  onSend,
  status,
  promptLabel = "Your setup question",
}: {
  available: boolean;
  busy: boolean;
  onSend: (text: string) => Promise<string>;
  status: string;
  promptLabel?: string;
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
          {promptLabel}
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
