/**
 * @ainativekit/devtools
 * Development tools for building and testing ChatGPT Apps using ChatGPT Apps SDK
 *
 * @packageDocumentation
 * A powerful, zero-configuration development environment for building ChatGPT apps.
 * Simulates the ChatGPT production environment locally with interactive controls
 * for testing different states, themes, and device types.
 *
 * @example
 * ```tsx
 * import { DevContainer } from '@ainativekit/devtools';
 * import { ThemeProvider } from '@ainativekit/ui';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <DevContainer
 *         loadingDelay={2000}
 *         dataLoader={async () => ({ data: 'mock' })}
 *         emptyDataLoader={() => ({ data: [] })}
 *       >
 *         <YourWidget />
 *       </DevContainer>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */

/**
 * Main development container component that simulates ChatGPT environment
 * @see {@link DevContainerProps} for configuration options
 */
export { DevContainer } from './components/DevContainer';

/**
 * Multi-widget development router for managing multiple widgets in a single dev server
 * Enables quick navigation between widgets without managing multiple ports
 * @see {@link MultiWidgetRouterProps} for configuration options
 * @example
 * ```tsx
 * import { MultiWidgetRouter } from '@ainativekit/devtools';
 * import { ThemeProvider } from '@ainativekit/ui';
 * import CarouselApp from './widget-carousel/App';
 * import MapApp from './widget-map/App';
 *
 * function DevEntry() {
 *   return (
 *     <ThemeProvider>
 *       <MultiWidgetRouter
 *         widgets={[
 *           { id: 'carousel', name: 'Carousel', component: CarouselApp },
 *           { id: 'map', name: 'Map', component: MapApp }
 *         ]}
 *         sharedConfig={{ loadingDelay: 2000, theme: 'light' }}
 *         dataLoaders={{ restaurants: () => mockData }}
 *         defaultDataLoader="restaurants"
 *       />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export { MultiWidgetRouter } from './components/MultiWidgetRouter';

// Type exports
export type {
  /**
   * Configuration props for DevContainer component
   */
  DevContainerProps,
  /**
   * Device type for viewport simulation ('desktop' | 'tablet' | 'mobile')
   */
  DeviceType,
  /**
   * Debug mode options ('none' | 'border')
   */
  DebugMode,
  /**
   * Widget state for testing ('loading' | 'data' | 'empty' | 'error')
   */
  WidgetState,
  // Re-exported from ChatGPT Apps SDK (@ainativekit/ui)
  Theme,
  OpenAiGlobals,
  DisplayMode,
  SetGlobalsEvent,
} from './types';

/**
 * MultiWidgetRouter-specific types
 */
export type {
  /**
   * Widget configuration for MultiWidgetRouter
   */
  Widget,
  /**
   * Configuration props for MultiWidgetRouter component
   */
  MultiWidgetRouterProps,
} from './components/MultiWidgetRouter';

/**
 * Utility functions for mock data management
 *
 * Provides helpers to create and manage mock data states for development and testing.
 * Works with any data structure and is fully type-safe.
 *
 * @example
 * ```typescript
 * import { createMockData } from '@ainativekit/devtools';
 *
 * const mockRestaurants = createMockData(fullData, {
 *   emptyTransform: (data) => ({ ...data, restaurants: [], totalResults: 0 })
 * });
 *
 * // Use in MultiWidgetRouter
 * <MultiWidgetRouter
 *   dataLoaders={{ restaurants: () => mockRestaurants.full }}
 *   emptyDataLoaders={{ restaurants: () => mockRestaurants.empty }}
 * />
 * ```
 */
export { createMockData } from './utils/createMockData';
export type { MockData, MockDataConfig } from './utils/createMockData';

/**
 * Viewport width presets for device simulation
 * @constant
 * @property {number} desktop - 768px width
 * @property {number} tablet - 640px width
 * @property {number} mobile - 375px width
 */
export { VIEWPORT_PRESETS } from './types';

/**
 * Current version of @ainativekit/devtools
 * @constant
 */
export const VERSION = '0.2.0';