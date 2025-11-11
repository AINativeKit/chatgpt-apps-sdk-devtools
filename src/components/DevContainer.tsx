import React, { useEffect, useState, useMemo } from 'react';
import { SetGlobalsEvent, type OpenAiGlobals, type Theme, Button, Chip } from '@ainativekit/ui';
import type { DevContainerProps, Widget } from '../types';

/**
 * DevContainer - Development environment for ChatGPT Apps
 *
 * Simulates the ChatGPT production environment for local development.
 * Supports both single widget and multi-widget development with automatic
 * detection and appropriate UI.
 *
 * @example
 * // Single widget
 * <DevContainer dataLoader={() => mockData}>
 *   <MyWidget />
 * </DevContainer>
 *
 * @example
 * // Multiple widgets
 * <DevContainer
 *   widgets={[
 *     { id: 'widget1', name: 'Widget 1', component: Widget1 },
 *     { id: 'widget2', name: 'Widget 2', component: Widget2 }
 *   ]}
 *   dataLoaders={{ data1: () => mockData1, data2: () => mockData2 }}
 * />
 */

/**
 * Error Boundary to catch and display widget errors gracefully
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 [@ainativekit/devtools] Widget crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c00',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <strong>⚠️ Widget Error</strong>
          <p style={{ margin: '10px 0' }}>
            The widget crashed. Check the console for details.
          </p>
          {this.state.error && (
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer' }}>Error details</summary>
              <pre style={{
                marginTop: '10px',
                padding: '10px',
                background: '#fff',
                overflow: 'auto'
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function DevContainer({
  // Single widget props (simple case)
  children,
  dataLoader,
  emptyDataLoader,

  // Multi-widget props
  widgets,
  dataLoaders,
  emptyDataLoaders,
  defaultDataLoader,
  defaultWidget,

  // Common props
  loadingDelay = 2000,
  theme: initialTheme = 'light',
  autoLoad = true,
  toolbarPosition = 'top',
}: DevContainerProps) {
  // Normalize to multi-widget structure for consistent handling
  const normalizedWidgets = useMemo((): Widget[] => {
    if (widgets && widgets.length > 0) {
      return widgets;
    }
    if (children) {
      return [{ id: 'default', name: 'App', component: () => children as React.ReactElement }];
    }
    return [];
  }, [widgets, children]);

  const normalizedDataLoaders = useMemo(() => {
    if (dataLoaders) return dataLoaders;
    if (dataLoader) return { default: dataLoader };
    return {};
  }, [dataLoaders, dataLoader]);

  const normalizedEmptyLoaders = useMemo(() => {
    if (emptyDataLoaders) return emptyDataLoaders;
    if (emptyDataLoader) return { default: emptyDataLoader };
    return {};
  }, [emptyDataLoaders, emptyDataLoader]);

  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [widgetState, setWidgetState] = useState<'loading' | 'data' | 'error' | 'empty'>('loading');
  const [isLoading, setIsLoading] = useState(false);
  const [showDevTools] = useState(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [activeWidgetId, setActiveWidgetId] = useState(defaultWidget || normalizedWidgets[0]?.id || '');
  const [activeDataLoader, setActiveDataLoader] = useState(defaultDataLoader || Object.keys(normalizedDataLoaders)[0] || '');

  // Interactive controls state
  const [mockTheme, setMockTheme] = useState<Theme>(initialTheme);
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewportWidth, setViewportWidth] = useState<number>(768);
  const [debugMode, setDebugMode] = useState<'none' | 'border'>('none');

  // Show widget selector only if there are multiple widgets
  const showWidgetSelector = normalizedWidgets.length > 1;

  // Sync URL with active widget
  useEffect(() => {
    if (!showWidgetSelector) return;

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const widgetId = params.get('widget');
      if (widgetId && normalizedWidgets.some(w => w.id === widgetId)) {
        setActiveWidgetId(widgetId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, [showWidgetSelector, normalizedWidgets]);

  // Update URL when widget changes
  useEffect(() => {
    if (!showWidgetSelector) return;

    const params = new URLSearchParams(window.location.search);
    if (activeWidgetId && activeWidgetId !== 'default') {
      params.set('widget', activeWidgetId);
    } else {
      params.delete('widget');
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    if (window.location.search !== newUrl.slice(window.location.pathname.length)) {
      window.history.pushState(null, '', newUrl);
    }

    // Persist to localStorage
    if (activeWidgetId) {
      localStorage.setItem('devtools.activeWidget', activeWidgetId);
    }
  }, [activeWidgetId, showWidgetSelector]);

  // Restore from localStorage
  useEffect(() => {
    if (!showWidgetSelector) return;

    const params = new URLSearchParams(window.location.search);
    const urlWidget = params.get('widget');
    const savedWidget = localStorage.getItem('devtools.activeWidget');

    if (urlWidget && normalizedWidgets.some(w => w.id === urlWidget)) {
      setActiveWidgetId(urlWidget);
    } else if (savedWidget && normalizedWidgets.some(w => w.id === savedWidget)) {
      setActiveWidgetId(savedWidget);
    }
  }, [showWidgetSelector, normalizedWidgets]);

  // Sync theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mockTheme);

    // Also set body background color
    const bgColor = mockTheme === 'dark' ? '#1e1e1e' : '#ffffff';
    document.body.style.backgroundColor = bgColor;
  }, [mockTheme]);

  // Set globals helper
  const setGlobals = (globals: Partial<OpenAiGlobals>) => {
    if (!window.openai) {
      (window as any).openai = {};
    }
    Object.assign(window.openai as any, globals);
    const event = new SetGlobalsEvent({ globals });
    window.dispatchEvent(event);
  };

  // Get userAgent based on device type
  const getUserAgent = (device: 'desktop' | 'tablet' | 'mobile') => ({
    device: { type: device },
    capabilities: {
      hover: device === 'desktop',
      touch: device !== 'desktop'
    }
  });

  // Initialize window.openai
  useEffect(() => {
    console.log('🔧 [@ainativekit/devtools] Initializing dev environment...');

    // Create mock window.openai
    (window as any).openai = {
      callTool: async (name: string, args: any) => {
        console.log('🔨 Mock callTool:', { name, args });
        return { success: true, data: 'Mock response' };
      },
      sendFollowUpMessage: async ({ prompt }: { prompt: string }) => {
        console.log('💬 Mock sendFollowUpMessage:', prompt);
        return { success: true };
      },
      openExternal: ({ href }: { href: string }) => {
        console.log('🌐 Mock openExternal:', href);
        window.open(href, '_blank');
      },
      setWidgetState: (state: any) => {
        console.log('💾 Mock setWidgetState:', state);
      },
      theme: mockTheme,
      toolOutput: null,
      locale: 'en-US',
      maxHeight: 600,
      userAgent: getUserAgent(deviceType)
    };

    setIsInitialized(true);
    console.log('✅ [@ainativekit/devtools] Dev environment ready');

    // Auto-load data if configured
    if (autoLoad) {
      handleDelayedData();
    }
  }, []);

  // Update theme
  useEffect(() => {
    setGlobals({ theme: mockTheme });
  }, [mockTheme]);

  // Update device type
  useEffect(() => {
    const widths = { desktop: 768, tablet: 640, mobile: 375 };
    setViewportWidth(widths[deviceType]);
    setGlobals({ userAgent: getUserAgent(deviceType) });
  }, [deviceType]);

  // Data handlers
  const handleInstantData = async () => {
    console.log('📦 Loading data instantly...');
    setWidgetState('loading');
    setIsLoading(false);

    try {
      const loader = normalizedDataLoaders[activeDataLoader];
      if (!loader) {
        console.warn('⚠️ No data loader found for key:', activeDataLoader);
        setGlobals({ toolOutput: {} });
      } else {
        const data = await loader();
        setGlobals({ toolOutput: data });
        console.log('✅ Data loaded:', data);
      }
      setWidgetState('data');
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setWidgetState('error');
      setGlobals({ toolOutput: { error: error instanceof Error ? error.message : 'Unknown error' } });
    }
  };

  const handleDelayedData = async () => {
    console.log(`⏳ Loading data with ${loadingDelay}ms delay...`);
    setWidgetState('loading');
    setIsLoading(true);
    setGlobals({ toolOutput: null });

    await new Promise(resolve => setTimeout(resolve, loadingDelay));

    if (isLoading) {
      await handleInstantData();
    }
    setIsLoading(false);
  };

  const handleShowEmpty = async () => {
    console.log('📭 Showing empty state...');
    setWidgetState('empty');
    setIsLoading(false);

    const loader = normalizedEmptyLoaders[activeDataLoader];
    if (!loader) {
      setGlobals({ toolOutput: {} });
    } else {
      try {
        const emptyData = await loader();
        setGlobals({ toolOutput: emptyData });
        console.log('✅ Empty state loaded:', emptyData);
      } catch (error) {
        console.error('❌ Error loading empty state:', error);
        setGlobals({ toolOutput: {} });
      }
    }
  };

  const handleShowError = () => {
    console.log('❌ Showing error state...');
    setWidgetState('error');
    setIsLoading(false);
    setGlobals({
      toolOutput: {
        error: 'Something went wrong',
        message: 'This is a simulated error for testing error states'
      }
    });
  };

  const handleShowLoading = () => {
    console.log('⏳ Showing loading state...');
    setWidgetState('loading');
    setIsLoading(false);
    setGlobals({ toolOutput: null });
  };

  if (!isInitialized) {
    return <div>Initializing dev environment...</div>;
  }

  const activeWidget = normalizedWidgets.find(w => w.id === activeWidgetId) || normalizedWidgets[0];
  if (!activeWidget) {
    return <div>No widget configured. Pass children or widgets prop to DevContainer.</div>;
  }

  const ActiveComponent = activeWidget.component;

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      {/* Dev Toolbar */}
      {showDevTools && (
        <div style={{
          position: 'fixed',
          [toolbarPosition]: 0,
          left: 0,
          right: 0,
          background: 'var(--ai-color-bg-secondary, #f9f9f9)',
          borderBottom: toolbarPosition === 'top' ? '1px solid var(--ai-color-border-primary, #e0e0e0)' : 'none',
          borderTop: toolbarPosition === 'bottom' ? '1px solid var(--ai-color-border-primary, #e0e0e0)' : 'none',
          padding: '12px 20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          {/* Main Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px', marginRight: '8px' }}>
              🔧 Dev Tools
            </span>

            {/* Widget Selector (only shown for multiple widgets) */}
            {showWidgetSelector && (
              <select
                value={activeWidgetId}
                onChange={(e) => setActiveWidgetId(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--ai-color-border-primary, #ddd)',
                  background: 'var(--ai-color-bg-primary, white)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  minWidth: '150px'
                }}
              >
                {normalizedWidgets.map(widget => (
                  <option key={widget.id} value={widget.id}>
                    {widget.name}
                  </option>
                ))}
              </select>
            )}

            {/* Data Loader Selector (if multiple) */}
            {Object.keys(normalizedDataLoaders).length > 1 && (
              <select
                value={activeDataLoader}
                onChange={(e) => setActiveDataLoader(e.target.value)}
                title="Select data source"
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--ai-color-border-primary, #ddd)',
                  background: 'var(--ai-color-bg-primary, white)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  minWidth: '120px'
                }}
              >
                {Object.keys(normalizedDataLoaders).map(key => (
                  <option key={key} value={key}>
                    Data: {key}
                  </option>
                ))}
              </select>
            )}

            {/* State Controls */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={handleShowLoading}
                disabled={widgetState === 'loading' && !isLoading}
              >
                Loading
              </Button>
              <Button
                onClick={handleInstantData}
                disabled={isLoading}
              >
                Instant Data
              </Button>
              <Button
                onClick={handleDelayedData}
                disabled={isLoading}
              >
                Delayed Data
              </Button>
              <Button
                onClick={handleShowEmpty}
                disabled={isLoading}
              >
                Empty
              </Button>
              <Button
                onClick={handleShowError}
                disabled={isLoading}
              >
                Error
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              onClick={() => setMockTheme(mockTheme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${mockTheme === 'light' ? 'dark' : 'light'} theme`}
            >
              {mockTheme === 'light' ? '🌙' : '☀️'}
            </Button>

            {/* Advanced Toggle */}
            <Button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            >
              {showAdvancedSettings ? '▼' : '▶'} Advanced
            </Button>
          </div>

          {/* Advanced Settings */}
          {showAdvancedSettings && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Device Type */}
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as 'desktop' | 'tablet' | 'mobile')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--ai-color-border-primary, #ddd)',
                  background: 'var(--ai-color-bg-primary, white)',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <option value="desktop">💻 Desktop (768px)</option>
                <option value="tablet">📱 Tablet (640px)</option>
                <option value="mobile">📱 Mobile (375px)</option>
              </select>

              {/* Debug Mode */}
              <Button
                onClick={() => setDebugMode(debugMode === 'none' ? 'border' : 'none')}
                title="Toggle debug border"
              >
                Debug: {debugMode === 'border' ? 'ON' : 'OFF'}
              </Button>

              {/* Status Chips */}
              <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                <Chip>
                  State: {widgetState}
                </Chip>
                <Chip>
                  Theme: {mockTheme}
                </Chip>
                <Chip>
                  Width: {viewportWidth}px
                </Chip>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        paddingTop: showDevTools && toolbarPosition === 'top'
          ? showAdvancedSettings ? '120px' : '70px'
          : '0',
        paddingBottom: showDevTools && toolbarPosition === 'bottom'
          ? showAdvancedSettings ? '120px' : '70px'
          : '0',
      }}>
        {/* Viewport Constraint */}
        <div style={{
          maxWidth: `${viewportWidth}px`,
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          overflowX: 'hidden',
        }}>
          <ErrorBoundary>
            <ActiveComponent />
          </ErrorBoundary>

          {/* Debug Border */}
          {debugMode === 'border' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                border: '2px dashed red',
                zIndex: 9998,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}