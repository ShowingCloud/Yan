import { z } from 'zod';

// Zod schemas for CMS operations

// Example: Page Layout schema
export const PageLayoutSchema = z.object({
  path: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  schema: z.record(z.unknown()), // JSON schema for page tree
  isPublished: z.boolean().default(false),
});

export type PageLayout = z.infer<typeof PageLayoutSchema>;

// Example: Site Config schema
export const SiteConfigSchema = z.object({
  domain: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  settings: z.record(z.unknown()).optional(), // Theme tokens, etc.
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;

// Add more schemas as needed

