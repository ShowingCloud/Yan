import { z } from 'zod';
import type { ComponentType, ReactElement } from 'react';

/**
 * Component Map Schema
 * Defines the mapping between component names and their implementations
 */

export const ComponentMapEntrySchema = z.object({
  name: z.string(), // Component name (e.g., "ProductList", "Hero", "Button")
  importPath: z.string(), // Path to import the component (e.g., "@repo/commerce/ui/ProductList")
  props: z.record(z.unknown()).optional(), // Default props for the component
  isClient: z.boolean().optional().default(false), // Whether this is a client component
});

export type ComponentMapEntry = z.infer<typeof ComponentMapEntrySchema>;

export const ComponentMapSchema = z.record(ComponentMapEntrySchema);

export type ComponentMap = z.infer<typeof ComponentMapSchema>;

/**
 * Component Registry
 * Stores dynamically loaded components at runtime
 */
class ComponentRegistry {
  private components: Map<string, ComponentType<any>> = new Map();
  private loadingPromises: Map<string, Promise<ComponentType<any>>> = new Map();

  /**
   * Register a component
   */
  register(name: string, component: ComponentType<any>): void {
    this.components.set(name, component);
  }

  /**
   * Get a component by name
   */
  get(name: string): ComponentType<any> | undefined {
    return this.components.get(name);
  }

  /**
   * Load a component dynamically from an import path
   */
  async loadComponent(entry: ComponentMapEntry): Promise<ComponentType<any>> {
    const { name, importPath } = entry;

    // Check if already loaded
    if (this.components.has(name)) {
      return this.components.get(name)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!;
    }

    // Start loading
    const loadPromise = (async () => {
      try {
        // Dynamic import
        const module = await import(importPath);
        const component = module.default || module[name] || module[Object.keys(module)[0]];

        if (!component) {
          throw new Error(`Component not found in ${importPath}`);
        }

        // Register for future use
        this.components.set(name, component);
        this.loadingPromises.delete(name);

        return component;
      } catch (error) {
        this.loadingPromises.delete(name);
        console.error(`Failed to load component ${name} from ${importPath}:`, error);
        throw error;
      }
    })();

    this.loadingPromises.set(name, loadPromise);
    return loadPromise;
  }

  /**
   * Clear the registry (useful for testing)
   */
  clear(): void {
    this.components.clear();
    this.loadingPromises.clear();
  }
}

// Singleton instance
export const componentRegistry = new ComponentRegistry();

/**
 * Default component map
 * This can be extended by the host application
 */
export const defaultComponentMap: ComponentMap = {
  // Commerce components
  ProductList: {
    name: 'ProductList',
    importPath: '@repo/commerce/ui',
    isClient: false,
  },
  ProductCard: {
    name: 'ProductCard',
    importPath: '@repo/commerce/ui',
    isClient: true,
  },
  // AI Editor components
  VisualEditor: {
    name: 'VisualEditor',
    importPath: '@repo/ai-editor/ui',
    isClient: true,
  },
  // Generic UI components
  Button: {
    name: 'Button',
    importPath: '@repo/ui/components/Button',
    isClient: true,
  },
  Container: {
    name: 'Container',
    importPath: '@repo/ui/components/Container',
    isClient: false,
  },
};
