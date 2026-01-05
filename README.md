# CMS (Yan)

**Standalone Product 2** - Page Hierarchy, Routing Logic, and Theme Management

## Overview

The CMS package is a standalone Full-Stack Package (FSP) that provides page hierarchy management, routing logic, and theme management capabilities. It consumes the AI Editor as a dependency while maintaining its independence as a standalone product.

## Responsibilities

- Page Hierarchy management
- Routing Logic
- Theme Management

## Architecture

This package follows the **Full-Stack Package (FSP)** pattern:

- **UI Components** - React components (Client and Server)
- **Server Actions** - Next.js Server Actions (`'use server'`)
- **Route Handlers** - API route factories for mounting
- **Data Schema** - Own Prisma schema with distinct table names

## Independence

This package consumes the AI Editor as a dependency but remains a standalone product. It owns its own data schema (ContentSchema).

## Dependencies

- `@repo/ai-editor` - Uses Editor components and functionality

## Data

Owns `ContentSchema` - manages its own Prisma schema and database client.

**Tables:**
- `cms_site_configs` - Site configuration and theme settings
- `cms_page_layouts` - Page hierarchy and layout schemas

## Installation

```bash
pnpm install @repo/cms
```

## Usage

### Importing Components

```typescript
import { PageBuilder } from '@repo/cms/ui';
```

### Importing Server Actions

```typescript
import { createPage } from '@repo/cms/actions';

// In a Server Component or Server Action
const page = await createPage(pageData);
```

### Mounting Route Handlers (Host App)

```typescript
// apps/platform/app/api/cms/[...slug]/route.ts
import { createCMSHandler } from '@repo/cms/api';

const handler = createCMSHandler({});

export const POST = handler.POST;
export const GET = handler.GET;
```

## Package Exports

This package uses subpath exports for better tree-shaking:

- `@repo/cms` - Main entry (components, actions, lib)
- `@repo/cms/ui` - UI components only
- `@repo/cms/api` - Route handler factories
- `@repo/cms/actions` - Server Actions
- `@repo/cms/types` - TypeScript types and Zod schemas

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

## Dependencies

- **react** - UI components
- **next** - Server Actions and Route Handlers (peer dependency)
- **@repo/ai-editor** - AI Editor package
- **prisma** - Database ORM
- **zod** - Schema validation
- **server-only** - Prevents server code from leaking to client

## License

MIT License - see [LICENSE](./LICENSE) file for details.


