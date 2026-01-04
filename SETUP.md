# Setup Guide

This guide explains how to set up Algedi CMS in different environments.

## Standalone Setup

This is the default setup when cloning this repository directly.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apps/cms
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

## Monorepo Setup (Git Submodule)

When this repository is used as a git submodule in a Turborepo monorepo:

1. **Add as submodule** (from monorepo root)
   ```bash
   git submodule add <repository-url> apps/cms
   ```

2. **Configure workspace dependency** (in monorepo root `package.json`)
   ```json
   {
     "pnpm": {
       "overrides": {
         "@algedi/ai-editor": "workspace:*"
       }
     }
   }
   ```

3. **Install dependencies** (from monorepo root)
   ```bash
   pnpm install
   ```

4. **Run with Turbo**
   ```bash
   pnpm dev --filter @algedi/cms
   ```

## Dependencies

### Required

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Optional

- PostgreSQL (if using database features)
- Redis (if using caching)

## Troubleshooting

### AI Editor Package Not Found

If you see errors about `@algedi/ai-editor`:

**Standalone mode**: Install it separately or link locally:
```bash
pnpm add @algedi/ai-editor
# or
pnpm link ../ai-editor
```

**Monorepo mode**: Ensure the workspace override is configured in the root `package.json`.

### Port Already in Use

Change the port in `.env.local`:
```env
PORT=3001
```

Or use the `-p` flag:
```bash
pnpm dev -- -p 3001
```


