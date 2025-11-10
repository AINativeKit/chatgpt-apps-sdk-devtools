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
export const VERSION = '0.1.0';