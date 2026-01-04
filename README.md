# Algedi CMS

A Next.js 14 App Router application for the Algedi Multi-Tenant E-Commerce Platform. Handles authentication, routing, tenant configuration, and integrates with the AI Editor for page generation.

## Features

- **Next.js 14** with App Router
- **Tailwind CSS** with CSS Variables for multi-tenant theming
- **Radix UI** components
- **Zod** for input validation
- **TypeScript** for type safety
- Integration with `@algedi/ai-editor` package

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (or npm/yarn)
- PostgreSQL database (for production)
- Redis (optional, for caching)

## Installation

### Standalone Installation

```bash
# Clone the repository
git clone <repository-url>
cd apps/cms

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### As Part of Monorepo (Git Submodule)

If using as a git submodule in a Turborepo monorepo:

```bash
# From monorepo root
pnpm install
pnpm dev --filter @algedi/cms
```

**Note**: When used in a monorepo, the root `package.json` should override the `@algedi/ai-editor` dependency using the workspace protocol:

```json
{
  "pnpm": {
    "overrides": {
      "@algedi/ai-editor": "workspace:*"
    }
  }
}
```

## Environment Variables

Create a `.env.local` file in the root of this app:

```env
# Database (if using Prisma)
DATABASE_URL=postgres://user:password@localhost:5432/algedi_cms

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000

# AI Service (if using separate service)
AI_SERVICE_URL=http://localhost:3001

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Auth (configure based on your auth provider)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type check
pnpm type-check
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
apps/cms/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   └── components/       # React components
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

## API Routes

### `POST /api/ai/describe`

Queue an image description job.

**Request:**
```json
{
  "url": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "jobId": "job-123456"
}
```

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "cms"
}
```

## Integration with AI Editor

This CMS integrates with the `@algedi/ai-editor` package. To use it:

1. Install the package (if not in monorepo):
   ```bash
   pnpm add @algedi/ai-editor
   ```

2. Import and use in your components:
   ```tsx
   import { AIEditor } from "@algedi/ai-editor";

   <AIEditor
     tenantId="your-tenant-id"
     onCodeGenerated={(code) => console.log(code)}
   />
   ```

## Multi-Tenant Theming

The app uses CSS Variables for theming, allowing each tenant to have custom styles:

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #0070f3;
  /* ... */
}
```

Tenant-specific themes are loaded dynamically based on the current tenant configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](../LICENSE) file for details.

## Support

For issues and questions, please open an issue on the repository.

