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
 * Single widget (simple case):
 * ```tsx
 * import { DevContainer } from '@ainativekit/devtools';
 * import { ThemeProvider } from '@ainativekit/ui';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <DevContainer
 *         dataLoader={() => ({ data: 'mock' })}
 *         loadingDelay={2000}
 *       >
 *         <YourWidget />
 *       </DevContainer>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example
 * Multiple widgets:
 * ```tsx
 * import { DevContainer, createMockData } from '@ainativekit/devtools';
 *
 * const mockData = createMockData(
 *   { items: [...] },
 *   { emptyTransform: (data) => ({ ...data, items: [] }) }
 * );
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <DevContainer
 *         widgets={[
 *           { id: 'widget1', name: 'Widget 1', component: Widget1 },
 *           { id: 'widget2', name: 'Widget 2', component: Widget2 }
 *         ]}
 *         dataLoaders={{
 *           default: () => mockData.full
 *         }}
 *         emptyDataLoaders={{
 *           default: () => mockData.empty
 *         }}
 *       />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */

/**
 * Main development container component that simulates ChatGPT environment
 * Supports both single and multiple widget development
 * @see {@link DevContainerProps} for configuration options
 */
export { DevContainer } from './components/DevContainer';

/**
 * Utility function for creating type-safe mock data with automatic empty state generation
 * @see {@link MockData} for return type
 * @see {@link MockDataConfig} for configuration options
 */
export { createMockData } from './utils/createMockData';
export type { MockData, MockDataConfig } from './utils/createMockData';

// Type exports
export type {
  /**
   * Configuration props for DevContainer component
   */
  DevContainerProps,
  /**
   * Widget configuration for multi-widget mode
   */
  Widget,
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
 * Viewport width presets for device simulation
 * Aligned with OpenAI Apps SDK breakpoints (xs: 380, sm: 576, md: 768)
 * @constant
 * @property {number} desktop - 768px width (md breakpoint)
 * @property {number} tablet - 576px width (sm breakpoint)
 * @property {number} mobile - 380px width (xs breakpoint)
 */
export { VIEWPORT_PRESETS } from './types';

/**
 * Current version of @ainativekit/devtools
 * @constant
 */
export const VERSION = '1.0.0';