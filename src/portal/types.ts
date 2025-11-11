/**
 * Widget Portal types
 */

import type { ComponentType } from 'react';
import type { ScenarioCollection } from '../mock';

/**
 * Widget definition for the portal
 */
export interface WidgetDefinition {
  /** Unique widget ID (typically folder name) */
  id: string;

  /** Display name for the widget */
  name: string;

  /** The widget component to render */
  component: ComponentType<any>;

  /** Optional description */
  description?: string;

  /** Optional icon name from AINativeKit */
  icon?: string;

  /** Optional scenarios specific to this widget */
  scenarios?: ScenarioCollection;
}

/**
 * Props for WidgetPortal component
 */
export interface WidgetPortalProps {
  /** Array of widget definitions to display in portal */
  widgets: WidgetDefinition[];

  /** Default scenarios available to all widgets */
  defaultScenarios?: ScenarioCollection;

  /** Initial widget to display (defaults to first widget) */
  defaultWidget?: string;

  /** Initial theme */
  theme?: 'light' | 'dark';

  /** Loading delay for delayed scenario loading */
  loadingDelay?: number;
}
