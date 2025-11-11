/**
 * Helper for creating type-safe scenario collections
 */

import type { Scenario, ScenarioCollection } from './types';

/**
 * Create a type-safe scenario collection
 *
 * @example
 * ```tsx
 * const restaurantScenarios = createScenarios({
 *   full: {
 *     name: 'Full Results (9 items)',
 *     data: { type: 'search-results', items: [...] }
 *   },
 *   empty: {
 *     name: 'No Results',
 *     data: { type: 'search-results', items: [] }
 *   },
 *   slow: {
 *     name: 'Slow Network',
 *     data: { type: 'search-results', items: [...] },
 *     delay: 5000
 *   }
 * });
 * ```
 */
export function createScenarios<T = any>(
  scenarios: Record<string, Omit<Scenario<T>, 'name'> & { name: string }>
): ScenarioCollection<T> {
  const scenarioArray = Object.entries(scenarios).map(([key, scenario]) => ({
    ...scenario,
    id: key,
  }));

  return {
    scenarios: scenarioArray as Scenario<T>[],
  };
}

/**
 * Merge multiple scenario collections
 */
export function mergeScenarios<T = any>(
  ...collections: ScenarioCollection<T>[]
): ScenarioCollection<T> {
  return {
    scenarios: collections.flatMap(c => c.scenarios),
  };
}
