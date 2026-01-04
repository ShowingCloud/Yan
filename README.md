# CMS

**Standalone Product 2** - Page Hierarchy, Routing Logic, and Theme Management

## Overview

The CMS package provides page hierarchy management, routing logic, and theme management capabilities. It consumes the AI Editor as a dependency while maintaining its independence as a standalone product.

## Responsibilities

- Page Hierarchy management
- Routing Logic
- Theme Management

## Independence

This package consumes the AI Editor as a dependency but remains a standalone product. It owns its own data schema (ContentSchema).

## Dependencies

- `@repo/ai-editor` - Uses Editor components and functionality

## Data

Owns `ContentSchema` - manages its own Prisma schema and database client.

## Installation

```bash
pnpm install @repo/cms
```

## Usage

```typescript
import { PageBuilder } from '@repo/cms';

export default function CMSPage() {
  return <PageBuilder />;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma:generate

# Build
pnpm build

# Run migrations
pnpm prisma:migrate
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.

