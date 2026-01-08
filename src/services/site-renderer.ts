'use server';

import { prisma } from '../db';
import { componentRegistry, type ComponentMap, type ComponentMapEntry } from '../lib/component-map';
import { getTheme } from '../server/actions/theme-actions';
import type { ThemeConfig } from '../lib/theme-schema';
import React from 'react';

/**
 * Page Schema Structure
 * Represents the internal JSON structure of a page
 */
export interface PageNode {
  type: string; // Component name (e.g., "ProductList", "Hero")
  props?: Record<string, unknown>; // Component props
  children?: PageNode[]; // Nested components
  id?: string; // Optional unique ID for the node
}

export interface PageSchema {
  root: PageNode;
  metadata?: Record<string, unknown>;
}

/**
 * Site Renderer Service
 * Handles dynamic component selection and rendering
 */
export class SiteRenderer {
  /**
   * Get site configuration for an organization
   */
  static async getSiteConfig(organizationId: string) {
    return prisma.siteConfig.findUnique({
      where: { organizationId },
    });
  }

  /**
   * Get page layout by path
   */
  static async getPageLayout(organizationId: string, path: string) {
    return prisma.pageLayout.findFirst({
      where: {
        organizationId,
        path,
        isPublished: true,
      },
    });
  }

  /**
   * Resolve component from component map
   */
  static async resolveComponent(
    componentName: string,
    componentMap: ComponentMap
  ): Promise<ComponentMapEntry | null> {
    const entry = componentMap[componentName];
    if (!entry) {
      console.warn(`Component ${componentName} not found in component map`);
      return null;
    }
    return entry;
  }

  /**
   * Render a page node recursively
   * Returns the component and props for rendering
   * Note: Actual React rendering happens in the page component
   */
  static async renderNode(
    node: PageNode,
    componentMap: ComponentMap,
    context: {
      organizationId: string;
      theme?: ThemeConfig;
      [key: string]: unknown;
    }
  ): Promise<{
    Component: React.ComponentType<any>;
    props: Record<string, unknown>;
    children: Array<{ Component: React.ComponentType<any>; props: Record<string, unknown>; children: any[] }>;
  } | null> {
    const { type, props = {}, children = [] } = node;

    // Resolve component from map
    const componentEntry = await this.resolveComponent(type, componentMap);
    if (!componentEntry) {
      return null;
    }

    // Load component dynamically
    const Component = await componentRegistry.loadComponent(componentEntry);

    // Merge default props with node props
    const mergedProps = {
      ...componentEntry.props,
      ...props,
      ...context, // Pass context (organizationId, theme, etc.)
    };

    // Render children recursively
    const renderedChildren = await Promise.all(
      children.map((child) => this.renderNode(child, componentMap, context))
    );

    // Filter out null children
    const validChildren = renderedChildren.filter((child): child is NonNullable<typeof child> => child !== null);

    return {
      Component,
      props: mergedProps,
      children: validChildren,
    };
  }

  /**
   * Render a complete page
   */
  static async renderPage(
    organizationId: string,
    path: string,
    componentMap: ComponentMap,
    context?: Record<string, unknown>
  ) {
    // Get page layout
    const pageLayout = await this.getPageLayout(organizationId, path);
    if (!pageLayout) {
      return null;
    }

    // Get theme
    const theme = await getTheme(organizationId);

    // Parse page schema
    const schema = pageLayout.schema as PageSchema;

    // Render with context
    const renderContext = {
      organizationId,
      theme: theme || undefined,
      ...context,
    };

    // Render root node
    const rendered = await this.renderNode(schema.root, componentMap, renderContext);

    return {
      rendered,
      theme,
      metadata: pageLayout.metadata,
      pageLayout,
    };
  }

  /**
   * Get component map from site config
   */
  static async getComponentMap(organizationId: string): Promise<ComponentMap> {
    const siteConfig = await this.getSiteConfig(organizationId);
    if (!siteConfig?.settings) {
      return {};
    }

    const settings = siteConfig.settings as Record<string, unknown>;
    const componentMap = settings.componentMap as ComponentMap | undefined;

    return componentMap || {};
  }
}
