# Extract id and title from Linear URL

A tiny Raycast command that reads your clipboard, parses a Linear issue URL, and copies back a single string with the issue ID and title.

## Features

- Parses Linear URLs like:
  - `https://linear.app/<workspace>/issue/<TEAM-123>/<optional-slug>`
  - `https://linear.app/issue/<TEAM-123>/<optional-slug>`
- Copies to clipboard:
  - With slug: `TEAM-123 : Title` (separator configurable)
  - Without slug: `TEAM-123` (shows a warning HUD/toast)
- Shows a HUD and a toast so results are clearly visible

## Command

- Name: `Extract id and title from linear url`
- Mode: `no-view` (runs immediately, no UI)

## Preferences

- `Separator` (default `:`): String placed between ID and Title. Example values: `:`, `—`, `|`.

## Example

Clipboard contains:

```text
https://linear.app/your-workspace/issue/ABC-123/some-title-goes-here
```

Result copied to clipboard:

```text
ABC-123 : some title goes here
```

## Behavior

- If clipboard is empty → error toast.
- If clipboard is not a URL → error toast.
- If URL host isn’t `linear.app` or path doesn’t match → error toast.
- If the URL has no slug/title → copies only the ID and shows a warning-style HUD/toast.

## Development

Prerequisites: pnpm or a Nix/direnv-enabled shell (optional but recommended).

Common tasks:

- Develop: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`

### Icon

- Source: `assets/extension-icon.svg`
- Generated: `assets/extension-icon.png` (512×512)
- Commands:
  - Generate icon: `pnpm build:icon`
  - Automatically runs before `dev` and `build`

## License

MIT
