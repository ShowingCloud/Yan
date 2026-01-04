# Contributing to Algedi CMS

Thank you for your interest in contributing to Algedi CMS!

## Development Setup

### Standalone Development

This repository can be developed independently:

```bash
git clone <repository-url>
cd apps/cms
pnpm install
pnpm dev
```

### Monorepo Development

When used as a git submodule in a Turborepo monorepo:

1. The root `package.json` may override dependencies using workspace protocol
2. Use `pnpm install` from the monorepo root
3. Run commands with Turbo: `pnpm dev --filter @algedi/cms`

## Dependencies

### AI Editor Package

This CMS depends on `@algedi/ai-editor`. 

**Standalone mode**: Install from npm registry (when published) or link locally:
```bash
pnpm add @algedi/ai-editor
# or for local development
pnpm link ../ai-editor
```

**Monorepo mode**: The workspace protocol (`workspace:*`) will be used automatically.

## Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Run `pnpm lint` before committing
- Run `pnpm type-check` to ensure type safety

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request with a clear description

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

