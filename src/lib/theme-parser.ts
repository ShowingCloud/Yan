import type { ThemeConfig, ColorToken } from './theme-schema';

/**
 * Theme Parser
 * Converts theme configuration JSON to CSS variables
 */

/**
 * Convert RGB color token to CSS RGB string
 */
function colorToCSS(color: ColorToken): string {
  const { r, g, b, alpha } = color;
  if (alpha !== undefined && alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Convert RGB color token to CSS variable format (space-separated for Tailwind)
 */
function colorToCSSVariable(color: ColorToken): string {
  const { r, g, b } = color;
  return `${r} ${g} ${b}`;
}

/**
 * Generate CSS variables from theme configuration
 * @param theme - Theme configuration object
 * @returns CSS string with CSS variables
 */
export function themeToCSSVariables(theme: ThemeConfig): string {
  const variables: string[] = [];

  // Colors
  variables.push(`--color-primary: ${colorToCSSVariable(theme.colors.primary)};`);
  if (theme.colors.secondary) {
    variables.push(`--color-secondary: ${colorToCSSVariable(theme.colors.secondary)};`);
  }
  if (theme.colors.accent) {
    variables.push(`--color-accent: ${colorToCSSVariable(theme.colors.accent)};`);
  }
  if (theme.colors.success) {
    variables.push(`--color-success: ${colorToCSSVariable(theme.colors.success)};`);
  }
  if (theme.colors.warning) {
    variables.push(`--color-warning: ${colorToCSSVariable(theme.colors.warning)};`);
  }
  if (theme.colors.error) {
    variables.push(`--color-error: ${colorToCSSVariable(theme.colors.error)};`);
  }

  // Background colors
  variables.push(`--bg-primary: ${colorToCSSVariable(theme.colors.background.primary)};`);
  if (theme.colors.background.secondary) {
    variables.push(`--bg-secondary: ${colorToCSSVariable(theme.colors.background.secondary)};`);
  }
  if (theme.colors.background.tertiary) {
    variables.push(`--bg-tertiary: ${colorToCSSVariable(theme.colors.background.tertiary)};`);
  }

  // Text colors
  variables.push(`--text-primary: ${colorToCSSVariable(theme.colors.text.primary)};`);
  if (theme.colors.text.secondary) {
    variables.push(`--text-secondary: ${colorToCSSVariable(theme.colors.text.secondary)};`);
  }
  if (theme.colors.text.tertiary) {
    variables.push(`--text-tertiary: ${colorToCSSVariable(theme.colors.text.tertiary)};`);
  }

  // Border color
  if (theme.colors.border) {
    variables.push(`--border-color: ${colorToCSSVariable(theme.colors.border)};`);
  }

  // Typography
  variables.push(`--font-sans: ${theme.typography.fontFamily.sans};`);
  if (theme.typography.fontFamily.mono) {
    variables.push(`--font-mono: ${theme.typography.fontFamily.mono};`);
  }
  if (theme.typography.fontFamily.serif) {
    variables.push(`--font-serif: ${theme.typography.fontFamily.serif};`);
  }

  if (theme.typography.heading) {
    if (theme.typography.heading.fontSize) {
      variables.push(`--font-size-heading: ${theme.typography.heading.fontSize};`);
    }
    if (theme.typography.heading.fontWeight) {
      variables.push(`--font-weight-heading: ${theme.typography.heading.fontWeight};`);
    }
  }

  if (theme.typography.body) {
    if (theme.typography.body.fontSize) {
      variables.push(`--font-size-body: ${theme.typography.body.fontSize};`);
    }
    if (theme.typography.body.fontWeight) {
      variables.push(`--font-weight-body: ${theme.typography.body.fontWeight};`);
    }
  }

  // Spacing
  variables.push(`--spacing-xs: ${theme.spacing.xs};`);
  variables.push(`--spacing-sm: ${theme.spacing.sm};`);
  variables.push(`--spacing-md: ${theme.spacing.md};`);
  variables.push(`--spacing-lg: ${theme.spacing.lg};`);
  variables.push(`--spacing-xl: ${theme.spacing.xl};`);
  if (theme.spacing['2xl']) {
    variables.push(`--spacing-2xl: ${theme.spacing['2xl']};`);
  }
  if (theme.spacing['3xl']) {
    variables.push(`--spacing-3xl: ${theme.spacing['3xl']};`);
  }

  // Border radius
  variables.push(`--border-radius-sm: ${theme.borderRadius.sm};`);
  variables.push(`--border-radius-md: ${theme.borderRadius.md};`);
  variables.push(`--border-radius-lg: ${theme.borderRadius.lg};`);
  if (theme.borderRadius.full) {
    variables.push(`--border-radius-full: ${theme.borderRadius.full};`);
  }

  // Shadows
  if (theme.shadows) {
    variables.push(`--shadow-sm: ${theme.shadows.sm};`);
    variables.push(`--shadow-md: ${theme.shadows.md};`);
    variables.push(`--shadow-lg: ${theme.shadows.lg};`);
    if (theme.shadows.xl) {
      variables.push(`--shadow-xl: ${theme.shadows.xl};`);
    }
  }

  // Transitions
  if (theme.transitions) {
    if (theme.transitions.fast) {
      variables.push(`--transition-fast: ${theme.transitions.fast};`);
    }
    if (theme.transitions.base) {
      variables.push(`--transition-base: ${theme.transitions.base};`);
    }
    if (theme.transitions.slow) {
      variables.push(`--transition-slow: ${theme.transitions.slow};`);
    }
  }

  return `:root {\n  ${variables.join('\n  ')}\n}`;
}

/**
 * Generate inline style tag with theme CSS variables
 * @param theme - Theme configuration object
 * @returns HTML style tag string
 */
export function themeToStyleTag(theme: ThemeConfig): string {
  const css = themeToCSSVariables(theme);
  return `<style id="theme-variables">${css}</style>`;
}

/**
 * Apply theme to document root
 * @param theme - Theme configuration object
 */
export function applyThemeToDocument(theme: ThemeConfig): void {
  if (typeof document === 'undefined') {
    return; // Server-side, skip
  }

  const css = themeToCSSVariables(theme);
  const root = document.documentElement;

  // Parse and apply each variable
  const lines = css.split('\n');
  for (const line of lines) {
    const match = line.match(/--([^:]+):\s*(.+);/);
    if (match) {
      const [, name, value] = match;
      root.style.setProperty(`--${name.trim()}`, value.trim());
    }
  }
}

