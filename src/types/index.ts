/**
 * @ainativekit/devtools - Type definitions
 */

import type { Theme } from '@ainativekit/ui';

/**
 * Props for the DevContainer component
 */
export interface DevContainerProps {
  /**
   * The widget or app to wrap with dev tools
   */
  children: React.ReactNode;

  /**
   * Delay in milliseconds before setting toolOutput (simulates API call)
   * Useful for testing loading/shimmer states
   * @default 2000
   */
  loadingDelay?: number;

  /**
   * Initial theme for testing
   * @default 'light'
   */
  theme?: Theme;

  /**
   * Auto-load data on mount (like production ChatGPT)
   * @default true
   */
  autoLoad?: boolean;

  /**
   * Custom data loader function
   * Return your widget-specific mock data here
   * @example
   * ```typescript
   * dataLoader: async () => ({
   *   type: 'search-results',
   *   properties: await fetchMockProperties()
   * })
   * ```
   */
  dataLoader?: () => Promise<any> | any;

  /**
   * Custom empty data loader function
   * Return your widget-specific empty state data
   * If not provided, will return a generic empty object
   * @example
   * ```typescript
   * emptyDataLoader: () => ({
   *   type: 'search-results',
   *   properties: [],
   *   searchInfo: { totalResults: 0 }
   * })
   * ```
   */
  emptyDataLoader?: () => Promise<any> | any;

  /**
   * Initial visibility of dev tools
   * @default true
   */
  showDevTools?: boolean;

  /**
   * Position of the toolbar
   * @default 'top'
   */
  toolbarPosition?: 'top' | 'bottom';
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
export type WidgetState = 'loading' | 'data' | 'error';

/**
 * Viewport presets for device simulation
 */
export const VIEWPORT_PRESETS = {
  desktop: 768,
  tablet: 640,
  mobile: 375,
} as const;

/**
 * Re-export commonly used types from AINativeKit
 */
export type { Theme, OpenAiGlobals, DisplayMode, SetGlobalsEvent } from '@ainativekit/ui';