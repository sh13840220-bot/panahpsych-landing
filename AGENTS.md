# Custom Agent Rules for Panah Project

## Dependency & Lockfile Management
- Whenever `package.json` or any dependencies are modified, always run `bun install` to update `bun.lock` and keep the lockfile in sync.
- Ensure `bun.lock` is kept up-to-date in the workspace for seamless Git pushes and deployments.

## Design & Architecture Guidelines
- **Design System**: Japandi + Soft Glassmorphism (`--bg-main: #FAF9F6`, `--color-primary: #A8C5C0`, Vazirmatn font, RTL layout).
- **Security & Authentication**: All quiz assessments require user login/signup via Supabase to store results in the user's dashboard.
