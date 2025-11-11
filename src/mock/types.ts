/**
 * Mock scenario system types
 * Enables reusable test data scenarios across widgets
 */

/**
 * A single test scenario with data and optional delay
 */
export interface Scenario<T = any> {
  /** Display name for the scenario */
  name: string;

  /** The mock data to provide to the widget */
  data: T | (() => T | Promise<T>);

  /** Optional delay in ms to simulate network latency */
  delay?: number;

  /** Optional description for developer reference */
  description?: string;
}

/**
 * Collection of scenarios for a widget
 */
export interface ScenarioCollection<T = any> {
  /** Unique ID for this scenario collection */
  id?: string;

  /** All available scenarios */
  scenarios: Scenario<T>[];

  /** Default scenario to load on mount */
  defaultScenario?: string;
}

/**
 * Predefined common scenarios that work for most widgets
 */
export const commonScenarios = {
  loading: {
    name: 'Loading',
    data: null,
    delay: 2000,
    description: 'Simulates loading state'
  },
  error: {
    name: 'Error',
    data: { error: 'Failed to load data. Please try again.' },
    description: 'Simulates error state'
  },
  empty: {
    name: 'Empty',
    data: { items: [] },
    description: 'Simulates empty state with no results'
  }
} as const;
