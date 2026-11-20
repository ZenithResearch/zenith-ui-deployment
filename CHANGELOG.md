# Changelog

## [Unreleased]

### Fixed
- Clear inferred context and credential references when switching to an existing model server — a local-model preset cannot silently claim a different server’s capacity or carry over its authentication.

- Retain the secondary configuration control during on-page reviews — closing the native settings dialog restores keyboard focus after an asynchronous review.

- Package and export guided setup styles, and verify the current workspace/setup source hashes — downstream builds receive the complete controls and provenance checks cover the actual canonical components.

### Changed
- Guide connected accounts to an automatically loaded model picker with Hermes’s recommended default and clear activation copy — sign-in no longer ends in an unexplained blank model field, and approved device codes are hidden.
- Use the Hermes provider dropdown as the single provider selector — removes the duplicate shortcut row and keeps native provider naming consistent.

- Make Continue primary for installed Hermes and offer secondary on-page configuration — users can advance without entering settings, while quick settings retain keyboard focus and the landing context.

- Package the original Castalia cloud-reveal artwork with the Hermes entry — users see the requested pixel-art Zenith identity across desktop and portrait layouts.
- Format the reusable setup controls and exports — keeps the new guided-flow components readable for downstream review.

### Added
- Add a floating, nonmodal Hermes chat with minimize and keyboard focus handling — the configured guide can remain available on the welcome screen and throughout the Hub.
- Add status-aware service connection rows — saved and pending connections can be shown without presenting a duplicate connect action.
- Add a controlled native-provider and open-model picker — Hermes account sign-in, private API-key entry, machine-sized suggestions and existing model servers can share the quick configuration surface.
- Add a cloud-marked Hermes landing page with one state-aware action — hosts can offer installation or configuration without exposing setup controls before the user chooses.
- Add the controlled empty workspace console and separate style export — lightweight Hub can offer process authoring without preloading a SOP or owning Runtime state.

- Add reusable guided Hub setup, component selection, explicit state facts, reviewed plans and a connected Hermes chat surface — users can progress through environment setup without interpreting a flat deployment dashboard.

### Added
- Sanitized deployment component source baseline — make the component inspectable without private gallery assets or history.
