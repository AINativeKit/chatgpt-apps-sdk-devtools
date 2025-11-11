/**
 * Configuration for creating mock data variations
 */
export interface MockDataConfig<T> {
  /**
   * Transform function to create empty state from full data
   * If not provided and emptyData is not specified, returns empty object
   *
   * @example
   * ```typescript
   * emptyTransform: (data) => ({ ...data, items: [], count: 0 })
   * ```
   */
  emptyTransform?: (fullData: T) => T;

  /**
   * Optional explicit empty state
   * Takes precedence over emptyTransform
   *
   * @example
   * ```typescript
   * emptyData: { items: [], count: 0, status: 'empty' }
   * ```
   */
  emptyData?: T;
}

/**
 * Mock data with full and empty state variations
 *
 * Provides structured access to full and empty data states for testing widgets
 * in different scenarios.
 */
export interface MockData<T> {
  /** Full dataset with all data */
  full: T;
  /** Empty state (valid structure, no data) */
  empty: T;
}

/**
 * Creates mock data with automatic empty state generation
 *
 * This utility helps manage mock data for development by providing a consistent
 * way to define both full and empty data states. It works with any data structure
 * and is fully type-safe.
 *
 * @template T - The type of your mock data
 * @param fullData - The full dataset to use for testing
 * @param config - Optional configuration for empty state generation
 * @returns Object with full and empty data variations
 *
 * @example
 * **Basic usage with transform:**
 * ```typescript
 * interface RestaurantData {
 *   restaurants: Restaurant[];
 *   totalResults: number;
 * }
 *
 * const mockRestaurants = createMockData<RestaurantData>(
 *   { restaurants: [...], totalResults: 9 },
 *   {
 *     emptyTransform: (data) => ({
 *       ...data,
 *       restaurants: [],
 *       totalResults: 0
 *     })
 *   }
 * );
 *
 * console.log(mockRestaurants.full);   // Full restaurant data
 * console.log(mockRestaurants.empty);  // Empty restaurant data
 * ```
 *
 * @example
 * **Explicit empty data:**
 * ```typescript
 * const mockUsers = createMockData(
 *   { users: [...], page: 1 },
 *   {
 *     emptyData: { users: [], page: 1, message: 'No users found' }
 *   }
 * );
 * ```
 *
 * @example
 * **Auto-generated empty state (empty object):**
 * ```typescript
 * const mockData = createMockData({ items: [1, 2, 3] });
 * // mockData.empty = {}
 * ```
 */
export function createMockData<T>(
  fullData: T,
  config?: MockDataConfig<T>
): MockData<T> {
  // Priority 1: Use explicit empty data if provided
  if (config?.emptyData) {
    return {
      full: fullData,
      empty: config.emptyData
    };
  }

  // Priority 2: Use transform function if provided
  if (config?.emptyTransform) {
    return {
      full: fullData,
      empty: config.emptyTransform(fullData)
    };
  }

  // Priority 3: Fallback to empty object (typed as T for flexibility)
  return {
    full: fullData,
    empty: {} as T
  };
}
