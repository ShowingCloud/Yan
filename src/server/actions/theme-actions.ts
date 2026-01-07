'use server';

import { prisma } from '../db';
import type { ThemeConfig } from '../../lib/theme-schema';
import { ThemeConfigSchema } from '../../lib/theme-schema';

/**
 * Get theme configuration for an organization
 */
export async function getTheme(organizationId: string): Promise<ThemeConfig | null> {
  const siteConfig = await prisma.siteConfig.findUnique({
    where: { organizationId },
    select: { settings: true },
  });

  if (!siteConfig?.settings) {
    return null;
  }

  const settings = siteConfig.settings as Record<string, unknown>;
  const themeConfig = settings.themeConfig;

  if (!themeConfig) {
    return null;
  }

  // Validate and return theme
  try {
    return ThemeConfigSchema.parse(themeConfig);
  } catch (error) {
    console.error('Invalid theme configuration:', error);
    return null;
  }
}

/**
 * Save theme configuration for an organization
 */
export async function saveTheme(
  organizationId: string,
  theme: ThemeConfig
): Promise<{ success: boolean; message?: string }> {
  try {
    // Validate theme
    const validated = ThemeConfigSchema.parse(theme);

    // Get or create site config
    const siteConfig = await prisma.siteConfig.upsert({
      where: { organizationId },
      create: {
        organizationId,
        settings: {
          themeConfig: validated,
        },
      },
      update: {
        settings: {
          themeConfig: validated,
        },
      },
    });

    return {
      success: true,
      message: 'Theme saved successfully',
    };
  } catch (error) {
    console.error('Error saving theme:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to save theme',
    };
  }
}

