import { z } from 'zod';
import { ComponentMapSchema, type ComponentMap } from './component-map';
import { ThemeConfigSchema, type ThemeConfig } from './theme-schema';

/**
 * Site Definition Schema
 * Complete JSON structure for a site configuration
 */
export const SiteDefinitionSchema = z.object({
  // Site metadata
  name: z.string(),
  domain: z.string().optional(),
  description: z.string().optional(),

  // Theme configuration
  theme: ThemeConfigSchema.optional(),

  // Component map
  componentMap: ComponentMapSchema.optional(),

  // Site-wide settings
  settings: z
    .object({
      logo: z.string().url().optional(),
      favicon: z.string().url().optional(),
      footer: z.string().optional(),
      header: z.string().optional(),
    })
    .optional(),

  // Pages configuration
  pages: z
    .array(
      z.object({
        path: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        schema: z.any(), // PageSchema (defined in site-renderer.ts)
        isPublished: z.boolean().optional().default(false),
      })
    )
    .optional(),

  // Metadata
  metadata: z.record(z.unknown()).optional(),
});

export type SiteDefinition = z.infer<typeof SiteDefinitionSchema>;

/**
 * Convert SiteDefinition to SiteConfig database format
 */
export function siteDefinitionToSiteConfig(siteDefinition: SiteDefinition) {
  return {
    name: siteDefinition.name,
    domain: siteDefinition.domain,
    description: siteDefinition.description,
    settings: {
      themeConfig: siteDefinition.theme,
      componentMap: siteDefinition.componentMap,
      ...siteDefinition.settings,
    },
    metadata: siteDefinition.metadata,
  };
}

/**
 * Convert SiteConfig database format to SiteDefinition
 */
export function siteConfigToSiteDefinition(siteConfig: {
  name: string | null;
  domain: string | null;
  description: string | null;
  settings: unknown;
  metadata: unknown;
}): SiteDefinition {
  const settings = (siteConfig.settings || {}) as Record<string, unknown>;

  return {
    name: siteConfig.name || 'Untitled Site',
    domain: siteConfig.domain || undefined,
    description: siteConfig.description || undefined,
    theme: settings.themeConfig as ThemeConfig | undefined,
    componentMap: settings.componentMap as ComponentMap | undefined,
    settings: {
      logo: settings.logo as string | undefined,
      favicon: settings.favicon as string | undefined,
      footer: settings.footer as string | undefined,
      header: settings.header as string | undefined,
    },
    metadata: (siteConfig.metadata || {}) as Record<string, unknown>,
  };
}
