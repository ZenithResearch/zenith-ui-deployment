# Changelog

## [Unreleased]

### Changed
- Show only the latest Hermes reply in a heading-free glass panel, then fade it after reading time at 80 words per minute — the guide no longer leaves a transcript or an opaque card over the welcome scene.
- Pause decorative motion during setup and guide use, honor reduced motion and retain active time across visibility changes — the new scene remains usable and quiet while people read or configure services.
- Start the guide collapsed to an icon-free status dot, make the input's leading dot minimize it and adopt the landing GlassBox treatment — the guide occupies less space and uses the requested shared glass styling without a redundant minus control.
- Keep initial welcome actions on the cloud scene and put expanded setup in one native modal with a shared guide host — setup can expand without replacing the artwork or disabling the only chat composer.
- Make the compact Hermes pill a direct message composer and allow the branded landing’s Enter label — typing no longer requires opening another chat form, and Hub entry can stay separate from chat verification.
- Restore the cloud landing’s white-and-blue square buttons, offset shadow and monospace labels throughout welcome — keeps the new profile flow visually consistent with the selected pixel-art background.
- Separate installed Hermes software from the Hub guide-profile setup, with saved model-setting selection — an installed CLI no longer leads to a redundant install action.


### Fixed
- Reserve space below portrait entry actions for the floating message pill — Enter and Configure remain unobstructed while typing.
- Keep space between adjacent welcome actions — the restored offset button shadow no longer touches the secondary control.
- Refresh expired or blocked welcome reviews in place — owners can repair prerequisites or resume reading without navigating away or repeatedly applying a stale plan.
- Show a controller-check error and retry on the Hermes welcome screen — users can recover from an unavailable setup instead of facing an unexplained disabled action.
- Clear inferred context and credential references when switching to an existing model server — a local-model preset cannot silently claim a different server’s capacity or carry over its authentication.

- Retain the secondary configuration control during on-page reviews — closing the native settings dialog restores keyboard focus after an asynchronous review.

- Package and export guided setup styles, and verify the current workspace/setup source hashes — downstream builds receive the complete controls and provenance checks cover the actual canonical components.

### Changed
- Show the official source repository directly in the welcome installation review — owners can see exactly where Hermes comes from before installing.
- Guide connected accounts to an automatically loaded model picker with Hermes’s recommended default and clear activation copy — sign-in no longer ends in an unexplained blank model field, and approved device codes are hidden.
- Use the Hermes provider dropdown as the single provider selector — removes the duplicate shortcut row and keeps native provider naming consistent.

- Make Continue primary for installed Hermes and offer secondary on-page configuration — users can advance without entering settings, while quick settings retain keyboard focus and the landing context.

- Package the original Castalia cloud-reveal artwork with the Hermes entry — users see the requested pixel-art Zenith identity across desktop and portrait layouts.
- Format the reusable setup controls and exports — keeps the new guided-flow components readable for downstream review.

### Added
- Recreate the cloud landing with authored SVG formations, fixed custom glyphs and bounded ambient drift — the artwork can animate without loading a bitmap or moving the welcome controls.
- Let the Hermes input pill collapse into a circular launcher and reopen with its draft and conversation intact — the guide can stay available without occupying a full input row.
- Add an inline welcome canvas for source-install review, truthful progress and progressive Hermes model setup — onboarding can stay on one screen through the first chat without wrapping the older wizard.
- Add a floating, nonmodal Hermes chat with minimize and keyboard focus handling — the configured guide can remain available on the welcome screen and throughout the Hub.
- Add status-aware service connection rows — saved and pending connections can be shown without presenting a duplicate connect action.
- Add a controlled native-provider and open-model picker — Hermes account sign-in, private API-key entry, machine-sized suggestions and existing model servers can share the quick configuration surface.
- Add a cloud-marked Hermes landing page with one state-aware action — hosts can offer installation or configuration without exposing setup controls before the user chooses.
- Add the controlled empty workspace console and separate style export — lightweight Hub can offer process authoring without preloading a SOP or owning Runtime state.

- Add reusable guided Hub setup, component selection, explicit state facts, reviewed plans and a connected Hermes chat surface — users can progress through environment setup without interpreting a flat deployment dashboard.

### Added
- Sanitized deployment component source baseline — make the component inspectable without private gallery assets or history.
