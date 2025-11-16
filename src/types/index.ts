/**
 * @ainativekit/devtools - Type definitions
 */

import type { Theme, BrandColorConfig } from '@ainativekit/ui';

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

  /**
   * Toolbar position
   * @default 'top'
   */
  toolbarPosition?: 'top' | 'bottom';

  /**
   * Custom brand colors to apply to widgets
   * Supports light/dark mode variants
   * @example
   * ```typescript
   * brandColors: {
   *   primary: { light: '#137044', dark: '#71D19E' },
   *   success: '#10b981'
   * }
   * ```
   */
  brandColors?: BrandColorConfig;
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
 */
export const VIEWPORT_PRESETS = {
  desktop: 768,
  tablet: 640,
  mobile: 375,
} as const;

/**
 * Re-export commonly used types from ChatGPT Apps SDK (@ainativekit/ui)
 */
export type { Theme, OpenAiGlobals, DisplayMode, SetGlobalsEvent } from '@ainativekit/ui';