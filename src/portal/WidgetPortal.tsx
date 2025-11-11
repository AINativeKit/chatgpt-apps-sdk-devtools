/**
 * WidgetPortal - Centralized development environment for multiple widgets
 *
 * Provides:
 * - Widget switching (dropdown/tabs)
 * - Scenario management
 * - Shared DevContainer controls
 * - Clean separation of dev and production code
 */

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@ainativekit/ui';
import { DevContainer } from '../components/DevContainer';
import { ScenarioPicker } from './ScenarioPicker';
import type { WidgetPortalProps } from './types';
import type { Scenario } from '../mock';

export function WidgetPortal({
  widgets,
  defaultScenarios,
  defaultWidget,
  theme: initialTheme = 'light',
  loadingDelay = 2000,
}: WidgetPortalProps) {
  // Determine initial widget
  const initialWidgetId = defaultWidget || widgets[0]?.id;
  const [selectedWidgetId, setSelectedWidgetId] = useState<string>(initialWidgetId);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);

  // Get current widget
  const currentWidget = widgets.find(w => w.id === selectedWidgetId) || widgets[0];

  // Merge scenarios: widget-specific + default scenarios
  const allScenarios = [
    ...(currentWidget?.scenarios?.scenarios || []),
    ...(defaultScenarios?.scenarios || []),
  ];

  // Update URL when widget changes (for browser history/refresh support)
  useEffect(() => {
    if (selectedWidgetId) {
      const url = new URL(window.location.href);
      url.searchParams.set('widget', selectedWidgetId);
      window.history.replaceState({}, '', url);
    }
  }, [selectedWidgetId]);

  // Read widget from URL on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const widgetFromUrl = url.searchParams.get('widget');
    if (widgetFromUrl && widgets.some(w => w.id === widgetFromUrl)) {
      setSelectedWidgetId(widgetFromUrl);
    }
  }, []);

  // Data loader that uses selected scenario
  const dataLoader = async () => {
    if (!selectedScenario) {
      return {
        type: 'no-scenario',
        message: 'Select a scenario to load data',
      };
    }

    const data = typeof selectedScenario.data === 'function'
      ? await selectedScenario.data()
      : selectedScenario.data;

    return data;
  };

  // Handle scenario selection
  const handleSelectScenario = async (scenario: Scenario) => {
    console.log('🎬 [WidgetPortal] Scenario selected:', scenario.name);
    setSelectedScenario(scenario);

    const delay = scenario.delay ?? 0;

    if (delay > 0) {
      setIsLoadingScenario(true);
      // DevContainer will handle the delay and loading state
    }
  };

  if (widgets.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No widgets found</h2>
        <p>Add widgets to the portal to get started.</p>
      </div>
    );
  }

  if (!currentWidget) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Widget not found</h2>
        <p>The selected widget "{selectedWidgetId}" could not be found.</p>
      </div>
    );
  }

  const WidgetComponent = currentWidget.component;

  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Widget Portal Header - Non-overlapping with proper spacing */}
        <div
          style={{
            backgroundColor: 'var(--ai-color-bg-secondary)',
            borderBottom: '1px solid var(--ai-color-border-default)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Row 1: Widget Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--ai-color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '120px',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🎛️</span>
                <span>Portal</span>
              </div>

              <div
                style={{
                  height: '24px',
                  width: '1px',
                  backgroundColor: 'var(--ai-color-border-default)',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <label
                  htmlFor="widget-select"
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--ai-color-text-secondary)',
                    fontWeight: '500',
                  }}
                >
                  Widget:
                </label>

                <select
                  id="widget-select"
                  value={selectedWidgetId}
                  onChange={(e) => setSelectedWidgetId(e.target.value)}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    backgroundColor: 'var(--ai-color-bg-primary)',
                    color: 'var(--ai-color-text-primary)',
                    border: '1px solid var(--ai-color-border-default)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    minWidth: '240px',
                  }}
                >
                  {widgets.map((widget) => (
                    <option key={widget.id} value={widget.id}>
                      {widget.icon ? `${widget.icon} ` : ''}
                      {widget.name}
                    </option>
                  ))}
                </select>

                {currentWidget.description && (
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--ai-color-text-tertiary)',
                      fontStyle: 'italic',
                    }}
                  >
                    {currentWidget.description}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: Scenario Picker */}
            {allScenarios.length > 0 && (
              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid var(--ai-color-border-light)',
                }}
              >
                <ScenarioPicker
                  scenarios={allScenarios}
                  selectedScenario={selectedScenario?.name || null}
                  onSelectScenario={handleSelectScenario}
                  isLoading={isLoadingScenario}
                />
              </div>
            )}
          </div>
        </div>

        {/* Widget Content with DevContainer - DevContainer has its own fixed toolbar */}
        <div style={{ flex: 1 }}>
          <DevContainer
            dataLoader={dataLoader}
            loadingDelay={selectedScenario?.delay ?? loadingDelay}
            theme={initialTheme}
            autoLoad={false}
            toolbarPosition="top"
            key={`${selectedWidgetId}-${selectedScenario?.name || 'none'}`}
          >
            <WidgetComponent />
          </DevContainer>
        </div>
      </div>
    </ThemeProvider>
  );
}
