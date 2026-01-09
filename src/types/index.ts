/**
 * @ainativekit/devtools - Type definitions
 */

import type { Theme } from '@ainativekit/ui';

/**
 * Widget configuration for multi-widget development
 */
export interface Widget {
  /** Unique identifier for the widget */
  id: string;
  /** Display name for the widget selector */
  name: string;
  /** The widget component */
  component: React.ComponentType;
  /** Widget-specific data loader (optional) - single loader, hides dropdown */
  dataLoader?: () => Promise<any> | any;
  /** Widget-specific empty data loader (optional) */
  emptyDataLoader?: () => Promise<any> | any;
  /**
   * Widget-specific data loaders (optional) - multiple loaders with dropdown
   * When provided, only these data sources appear in the dropdown for this widget
   */
  dataLoaders?: Record<string, () => Promise<any> | any>;
  /**
   * Widget-specific empty data loaders (optional)
   * Should match keys in dataLoaders
   */
  emptyDataLoaders?: Record<string, () => Promise<any> | any>;
  /**
   * Default data loader key for this widget
   */
  defaultDataLoader?: string;
}

/**
 * Props for the DevContainer component
 * Supports both single widget (via children) and multi-widget (via widgets array) modes
 */
export interface DevContainerProps {
  // Single widget mode (simple case)
  /**
   * Single widget to wrap with dev tools
   * Use this for simple single-widget development
   */
  children?: React.ReactNode;

  /**
   * Data loader for single widget mode
   * @example
   * ```typescript
   * dataLoader: () => ({ type: 'data', items: [...] })
   * ```
   */
  dataLoader?: () => Promise<any> | any;

  /**
   * Empty state data loader for single widget mode
   */
  emptyDataLoader?: () => Promise<any> | any;

  // Multi-widget mode
  /**
   * Array of widgets for multi-widget development
   * When provided, enables widget selector dropdown
   * @example
   * ```typescript
   * widgets: [
   *   { id: 'carousel', name: 'Carousel', component: CarouselWidget },
   *   { id: 'map', name: 'Map', component: MapWidget }
   * ]
   * ```
   */
  widgets?: Widget[];

  /**
   * Map of data loaders for multi-widget mode
   * Keys are data source names, values are loader functions
   * @example
   * ```typescript
   * dataLoaders: {
   *   restaurants: () => restaurantData,
   *   locations: () => locationData
   * }
   * ```
   */
  dataLoaders?: Record<string, () => Promise<any> | any>;

  /**
   * Map of empty data loaders for multi-widget mode
   */
  emptyDataLoaders?: Record<string, () => Promise<any> | any>;

  /**
   * Default data loader key to use
   */
  defaultDataLoader?: string;

  /**
   * Default widget ID to show on load
   */
  defaultWidget?: string;

  // Common props
  /**
   * Delay in milliseconds before loading data (simulates network latency)
   * @default 2000
   */
  loadingDelay?: number;

  /**
   * Initial theme
   * @default 'light'
   */
  theme?: Theme;

  /**
   * Auto-load data on mount
   * @default true
   */
  autoLoad?: boolean;
}

/**
 * Device type for viewport simulation
 */
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

/**
 * Debug mode options
 */
export type DebugMode = 'none' | 'border';

/**
 * Widget state for testing
 */
export type WidgetState = 'loading' | 'data' | 'empty' | 'error';

/**
 * Viewport presets for device simulation
 * Aligned with OpenAI Apps SDK breakpoints:
 * xs: 380px, sm: 576px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
 */
export const VIEWPORT_PRESETS = {
  desktop: 768,
  tablet: 576,
  mobile: 380,
} as const;

/**
 * Re-export commonly used types from ChatGPT Apps SDK (@ainativekit/ui)
 */
export type { Theme, OpenAiGlobals, DisplayMode, SetGlobalsEvent } from '@ainativekit/ui';