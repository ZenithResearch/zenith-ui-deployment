# Zenith deployment UI

Public source baseline of the presentation component used by
[Zenith Hub lightweight](https://github.com/ZenithResearch/zenith-hub-lightweight).
The private design-gallery history, commercial fonts, investor decks and imagery
are not included. This is the deployment component, not the entire ZenithUI gallery.

```sh
npm ci
npm run check:source
npm run typecheck
npm run build
```

`DeploymentMonitor` receives component observations, checkpoints, offered actions,
an optional review and an `onAction` callback. It contains no network calls,
credentials, filesystem access or command execution. The host owns every action.
System fonts and CSS-variable fallbacks allow independent rendering.

The companion frontend vendors these exact source bytes with a public commit and
SHA256 provenance, so it builds without a sibling checkout or private registry.
The compiled ESM and declarations can also be built locally; import the component
and bundle its CSS with your application. No npm release is published.

The root project currently carries no reuse license; `UNLICENSED` preserves that
existing state rather than adding an unapproved license. Public visibility is
source availability, not an open-source license grant. See NOTICE.md.

## Empty workspace console

`WorkspaceConsole` is a controlled presentation component for native setup proposals, a Runtime-backed process catalog and draft editing/publication. It owns no storage, signing, execution or network calls. The consuming local Hub supplies state and callbacks. New consoles begin with an empty editor/catalog and no selected process or run. Import `@zenith-research/ui-deployment/workspace.css` for its styles.
