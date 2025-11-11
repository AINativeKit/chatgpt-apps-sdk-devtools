import React, { useState, useEffect } from 'react';
import { DevContainer } from './DevContainer';
import type { DevContainerProps } from '../types';

/**
 * Widget configuration for MultiWidgetRouter
 */
export interface Widget {
  /** Unique identifier for the widget */
  id: string;
  /** Display name shown in the widget selector */
  name: string;
  /** React component to render */
  component: React.ComponentType<any>;
}

/**
 * Props for MultiWidgetRouter component
 */
export interface MultiWidgetRouterProps {
  /** Array of widgets to make available */
  widgets: Widget[];
  /** Shared DevContainer configuration applied to all widgets */
  sharedConfig?: Omit<DevContainerProps, 'children' | 'dataLoader' | 'emptyDataLoader' | 'widgetSelector'>;
  /** Map of data loader functions by key */
  dataLoaders?: Record<string, () => Promise<any> | any>;
  /** Map of empty data loader functions by key - used for "Empty" button state */
  emptyDataLoaders?: Record<string, () => Promise<any> | any>;
  /** Key for the default data loader to use */
  defaultDataLoader?: string;
  /** ID of the widget to show by default */
  defaultWidget?: string;
}

/**
 * Multi-Widget Development Router
 *
 * Enables developers to quickly navigate between multiple widgets in a single dev server.
 * Provides a dropdown selector to switch between widgets without managing multiple ports.
 *
 * @example
 * ```tsx
 * <MultiWidgetRouter
 *   widgets={[
 *     { id: 'carousel', name: 'Carousel', component: CarouselApp },
 *     { id: 'map', name: 'Map', component: MapApp }
 *   ]}
 *   sharedConfig={{
 *     loadingDelay: 2000,
 *     theme: 'light'
 *   }}
 *   dataLoaders={{
 *     restaurants: () => mockRestaurantData
 *   }}
 *   defaultDataLoader="restaurants"
 * />
 * ```
 */
export function MultiWidgetRouter({
  widgets,
  sharedConfig = {},
  dataLoaders = {},
  emptyDataLoaders = {},
  defaultDataLoader = 'default',
  defaultWidget
}: MultiWidgetRouterProps) {
  /**
   * Get initial widget index from URL params, localStorage, or default
   */
  const getInitialWidgetIndex = (): number => {
    // 1. Check URL parameter: ?widget=map
    const params = new URLSearchParams(window.location.search);
    const urlWidgetId = params.get('widget');
    if (urlWidgetId) {
      const index = widgets.findIndex(w => w.id === urlWidgetId);
      if (index >= 0) return index;
    }

    // 2. Check localStorage for last used widget
    try {
      const lastWidgetId = localStorage.getItem('devtools:lastWidget');
      if (lastWidgetId) {
        const index = widgets.findIndex(w => w.id === lastWidgetId);
        if (index >= 0) return index;
      }
    } catch (e) {
      // localStorage might not be available
    }

    // 3. Use defaultWidget prop if specified
    if (defaultWidget) {
      const index = widgets.findIndex(w => w.id === defaultWidget);
      if (index >= 0) return index;
    }

    // 4. Fall back to first widget
    return 0;
  };

  const [activeIndex, setActiveIndex] = useState<number>(getInitialWidgetIndex);

  /**
   * Handle widget change with URL and localStorage sync
   */
  const handleWidgetChange = (index: number) => {
    setActiveIndex(index);
    const widgetId = widgets[index].id;

    // Update URL parameter
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('widget', widgetId);
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      // URL manipulation might fail in some environments
    }

    // Persist to localStorage for next session
    try {
      localStorage.setItem('devtools:lastWidget', widgetId);
    } catch (e) {
      // localStorage might not be available
    }
  };

  /**
   * Listen for browser back/forward navigation
   */
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const widgetId = params.get('widget');
      if (widgetId) {
        const index = widgets.findIndex(w => w.id === widgetId);
        if (index >= 0 && index !== activeIndex) {
          setActiveIndex(index);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [widgets, activeIndex]);

  // Get current widget component and data loaders
  const WidgetComponent = widgets[activeIndex].component;
  const dataLoader = dataLoaders[defaultDataLoader];
  const emptyDataLoader = emptyDataLoaders[defaultDataLoader];

  /**
   * Widget Selector UI Component
   * Styled to match ChatGPT/DevTools design system
   */
  const widgetSelector = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 8px'
      }}
    >
      <label
        htmlFor="widget-selector"
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--ai-color-text-primary)',
          userSelect: 'none'
        }}
      >
        Widget:
      </label>
      <select
        id="widget-selector"
        value={activeIndex}
        onChange={(e) => handleWidgetChange(Number(e.target.value))}
        style={{
          padding: '6px 10px',
          paddingRight: '28px',
          borderRadius: '6px',
          border: '1px solid var(--ai-color-border-default)',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          backgroundColor: 'var(--ai-color-bg-tertiary)',
          color: 'var(--ai-color-text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          minWidth: '160px'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLSelectElement).style.borderColor = 'var(--ai-color-border-heavy)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLSelectElement).style.borderColor = 'var(--ai-color-border-default)';
        }}
        onFocus={(e) => {
          (e.target as HTMLSelectElement).style.borderColor = 'var(--ai-state-focus-outline)';
          (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 2px rgba(2, 133, 255, 0.1)';
        }}
        onBlur={(e) => {
          (e.target as HTMLSelectElement).style.borderColor = 'var(--ai-color-border-default)';
          (e.target as HTMLSelectElement).style.boxShadow = 'none';
        }}
      >
        {widgets.map((widget, index) => (
          <option key={widget.id} value={index}>
            {widget.name}
          </option>
        ))}
      </select>
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--ai-color-text-tertiary)',
          marginLeft: '4px'
        }}
      >
        ({widgets.length} widget{widgets.length !== 1 ? 's' : ''})
      </span>
    </div>
  );

  return (
    <DevContainer
      {...sharedConfig}
      dataLoader={dataLoader}
      emptyDataLoader={emptyDataLoader}
      widgetSelector={widgetSelector}
    >
      <WidgetComponent key={widgets[activeIndex].id} />
    </DevContainer>
  );
}
