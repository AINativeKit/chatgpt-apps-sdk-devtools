import React, { useEffect, useState, useMemo } from 'react';
import { SetGlobalsEvent, AppsSDKUIProvider, type OpenAiGlobals, type Theme } from '@ainativekit/ui';
import type { DevContainerProps, Widget } from '../types';
import '../styles/devtools-theme.css';

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
          background: 'var(--ai-color-state-error-bg)',
          border: '1px solid var(--ai-color-state-error)',
          borderRadius: 'var(--ai-radius-sm)',
          color: 'var(--ai-color-state-error)',
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
                background: 'var(--ai-color-bg-primary)',
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
              background: 'var(--ai-color-bg-primary)',
              border: '1px solid var(--ai-color-border-default)',
              borderRadius: 'var(--ai-radius-sm)',
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
  const [activeDataLoader, setActiveDataLoader] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('devtools.activeDataLoader') : null;
    if (saved && Object.keys(normalizedDataLoaders).includes(saved)) {
      return saved;
    }
    return defaultDataLoader || Object.keys(normalizedDataLoaders)[0] || '';
  });

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

  // Persist activeDataLoader to localStorage
  useEffect(() => {
    if (activeDataLoader) {
      localStorage.setItem('devtools.activeDataLoader', activeDataLoader);
    }
  }, [activeDataLoader]);

  // Auto-load data when data loader changes (with loading delay)
  const prevDataLoaderRef = React.useRef(activeDataLoader);
  useEffect(() => {
    if (prevDataLoaderRef.current !== activeDataLoader && isInitialized) {
      prevDataLoaderRef.current = activeDataLoader;
      handleDelayedData();
    }
  }, [activeDataLoader, isInitialized]);

  // Auto-load data when widget changes (with loading delay)
  const prevWidgetIdRef = React.useRef(activeWidgetId);
  useEffect(() => {
    if (prevWidgetIdRef.current !== activeWidgetId && isInitialized) {
      prevWidgetIdRef.current = activeWidgetId;
      handleDelayedData();
    }
  }, [activeWidgetId, isInitialized]);

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

    // Use design token for body background to match card backgrounds
    document.body.style.backgroundColor = 'var(--ai-color-bg-primary)';
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
      widgetState: 'loading',
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

  // Update widgetState in window.openai
  useEffect(() => {
    if ((window as any).openai) {
      (window as any).openai.widgetState = widgetState;
      // Dispatch event so widgets can react
      window.dispatchEvent(new CustomEvent('openai:widgetState', { detail: widgetState }));
    }
  }, [widgetState]);

  // Update device type
  useEffect(() => {
    const widths = { desktop: 768, tablet: 640, mobile: 375 };
    setViewportWidth(widths[deviceType]);
    setGlobals({ userAgent: getUserAgent(deviceType) });
  }, [deviceType]);

  // Get the appropriate data loader for current widget
  const getActiveDataLoader = () => {
    const widget = normalizedWidgets.find(w => w.id === activeWidgetId);
    // Prefer widget-specific loader, fall back to global loaders
    if (widget?.dataLoader) return widget.dataLoader;
    return normalizedDataLoaders[activeDataLoader];
  };

  const getActiveEmptyLoader = () => {
    const widget = normalizedWidgets.find(w => w.id === activeWidgetId);
    // Prefer widget-specific empty loader, fall back to global loaders
    if (widget?.emptyDataLoader) return widget.emptyDataLoader;
    return normalizedEmptyLoaders[activeDataLoader];
  };

  // Data handlers
  const handleInstantData = async () => {
    console.log('📦 Loading data instantly...');
    setWidgetState('loading');
    setIsLoading(false);

    try {
      const loader = getActiveDataLoader();
      if (!loader) {
        console.warn('⚠️ No data loader found');
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

    // Load the data after delay
    try {
      const loader = getActiveDataLoader();
      if (!loader) {
        console.warn('⚠️ No data loader found');
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

    setIsLoading(false);
  };

  const handleShowEmpty = async () => {
    console.log('📭 Showing empty state...');
    setWidgetState('empty');
    setIsLoading(false);

    const loader = getActiveEmptyLoader();
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
          background: 'var(--ai-color-bg-primary)',
          borderBottom: '1px solid var(--ai-color-border-default)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {/* Main Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            {/* Logo and Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              paddingRight: '12px',
              borderRight: '1px solid var(--ai-color-border-default)',
              marginRight: '4px',
            }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              <span style={{
                fontWeight: '600',
                fontSize: '13px',
                color: 'var(--ai-color-text-primary)',
                letterSpacing: '-0.01em',
              }}>
                Dev Tools
              </span>
            </div>

            {/* Widget Selector (only shown for multiple widgets) */}
            {showWidgetSelector && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <select
                  value={activeWidgetId}
                  onChange={(e) => setActiveWidgetId(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    paddingRight: '28px',
                    borderRadius: '6px',
                    border: '1px solid var(--ai-color-border-heavy)',
                    background: 'var(--ai-color-bg-primary)',
                    color: 'var(--ai-color-text-primary)',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    minWidth: '140px',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--ai-color-state-info)';
                    e.target.style.boxShadow = '0 0 0 3px var(--ai-color-state-info-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--ai-color-border-heavy)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {normalizedWidgets.map(widget => (
                    <option key={widget.id} value={widget.id}>
                      {widget.name}
                    </option>
                  ))}
                </select>
                <span style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'var(--ai-color-text-secondary)',
                  fontSize: '10px',
                }}>▼</span>
              </div>
            )}

            {/* Data Loader Selector (only if multiple global loaders and current widget doesn't have its own) */}
            {Object.keys(normalizedDataLoaders).length > 1 && !normalizedWidgets.find(w => w.id === activeWidgetId)?.dataLoader && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <select
                  value={activeDataLoader}
                  onChange={(e) => setActiveDataLoader(e.target.value)}
                  title="Select data source"
                  style={{
                    padding: '5px 10px',
                    paddingRight: '28px',
                    borderRadius: '6px',
                    border: '1px solid var(--ai-color-border-heavy)',
                    background: 'var(--ai-color-bg-primary)',
                    color: 'var(--ai-color-text-primary)',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    minWidth: '110px',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--ai-color-state-info)';
                    e.target.style.boxShadow = '0 0 0 3px var(--ai-color-state-info-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--ai-color-border-heavy)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {Object.keys(normalizedDataLoaders).map(key => (
                    <option key={key} value={key}>
                      📊 {key}
                    </option>
                  ))}
                </select>
                <span style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'var(--ai-color-text-secondary)',
                  fontSize: '10px',
                }}>▼</span>
              </div>
            )}

            {/* Separator */}
            <div style={{
              width: '1px',
              height: '20px',
              background: 'var(--ai-color-border-default)',
              margin: '0 4px',
            }} />

            {/* State Controls */}
            <div style={{
              display: 'flex',
              gap: '4px',
              background: 'var(--ai-color-border-light)',
              padding: '3px',
              borderRadius: '8px',
            }}>
              <button
                onClick={handleShowLoading}
                disabled={widgetState === 'loading' && !isLoading}
                style={{
                  padding: '5px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  background: widgetState === 'loading' ? 'var(--ai-color-state-info)' : 'transparent',
                  color: widgetState === 'loading' ? 'var(--ai-color-brand-on-primary)' : 'var(--ai-color-text-secondary)',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: widgetState === 'loading' && !isLoading ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: (widgetState === 'loading' && !isLoading) ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (widgetState !== 'loading' && !e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'var(--ai-color-state-info-bg)';
                    e.currentTarget.style.color = 'var(--ai-color-state-info)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (widgetState !== 'loading') {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--ai-color-text-secondary)';
                  }
                }}
              >
                ⏳ Loading
              </button>
              <button
                onClick={handleInstantData}
                disabled={isLoading}
                style={{
                  padding: '5px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  background: widgetState === 'data' && !isLoading ? 'var(--ai-color-state-success)' : 'transparent',
                  color: widgetState === 'data' && !isLoading ? 'var(--ai-color-brand-on-primary)' : 'var(--ai-color-text-secondary)',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: isLoading ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (widgetState !== 'data' && !e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'var(--ai-color-state-success-bg)';
                    e.currentTarget.style.color = 'var(--ai-color-state-success)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (widgetState !== 'data' || isLoading) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--ai-color-text-secondary)';
                  }
                }}
              >
                ⚡ Instant
              </button>
              <button
                onClick={handleDelayedData}
                disabled={isLoading}
                style={{
                  padding: '5px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ai-color-text-secondary)',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: isLoading ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'var(--ai-color-state-success-bg)';
                    e.currentTarget.style.color = 'var(--ai-color-state-success)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--ai-color-text-secondary)';
                }}
              >
                ⏱️ Delayed
              </button>
              <button
                onClick={handleShowEmpty}
                disabled={isLoading}
                style={{
                  padding: '5px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  background: widgetState === 'empty' ? 'var(--ai-color-state-warning)' : 'transparent',
                  color: widgetState === 'empty' ? 'var(--ai-color-brand-on-primary)' : 'var(--ai-color-text-secondary)',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: isLoading ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (widgetState !== 'empty' && !e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'var(--ai-color-state-warning-bg)';
                    e.currentTarget.style.color = 'var(--ai-color-state-warning)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (widgetState !== 'empty') {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--ai-color-text-secondary)';
                  }
                }}
              >
                📭 Empty
              </button>
              <button
                onClick={handleShowError}
                disabled={isLoading}
                style={{
                  padding: '5px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  background: widgetState === 'error' ? 'var(--ai-color-state-error)' : 'transparent',
                  color: widgetState === 'error' ? 'var(--ai-color-brand-on-primary)' : 'var(--ai-color-text-secondary)',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: isLoading ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (widgetState !== 'error' && !e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'var(--ai-color-state-error-bg)';
                    e.currentTarget.style.color = 'var(--ai-color-state-error)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (widgetState !== 'error') {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--ai-color-text-secondary)';
                  }
                }}
              >
                ⚠️ Error
              </button>
            </div>

            {/* Separator */}
            <div style={{
              width: '1px',
              height: '20px',
              background: 'var(--ai-color-border-default)',
              margin: '0 4px',
            }} />

            {/* Theme Toggle */}
            <button
              onClick={() => setMockTheme(mockTheme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${mockTheme === 'light' ? 'dark' : 'light'} theme`}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--ai-color-border-heavy)',
                background: 'var(--ai-color-bg-primary)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--ai-state-hover-background)';
                e.currentTarget.style.borderColor = 'var(--ai-color-border-heavy)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--ai-color-bg-primary)';
                e.currentTarget.style.borderColor = 'var(--ai-color-border-heavy)';
              }}
            >
              {mockTheme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Spacer */}
            <div style={{ flex: 1, minWidth: '20px' }} />

            {/* Advanced Toggle */}
            <button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: showAdvancedSettings ? 'var(--ai-color-state-info-bg)' : 'transparent',
                color: showAdvancedSettings ? 'var(--ai-color-state-info)' : 'var(--ai-color-text-secondary)',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--ai-color-state-info-bg)';
                e.currentTarget.style.color = 'var(--ai-color-state-info)';
              }}
              onMouseLeave={(e) => {
                if (!showAdvancedSettings) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--ai-color-text-secondary)';
                }
              }}
            >
              <span style={{
                transform: showAdvancedSettings ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                fontSize: '10px',
              }}>
                ▶
              </span>
              Advanced
            </button>
          </div>

          {/* Advanced Settings */}
          {showAdvancedSettings && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              paddingTop: '8px',
              borderTop: '1px solid var(--ai-color-border-light)',
            }}>
              {/* Device Type */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ fontSize: '12px', color: 'var(--ai-color-text-secondary)', fontWeight: '500' }}>Device:</span>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value as 'desktop' | 'tablet' | 'mobile')}
                    style={{
                      padding: '4px 8px',
                      paddingRight: '24px',
                      borderRadius: '6px',
                      border: '1px solid var(--ai-color-border-heavy)',
                      background: 'var(--ai-color-bg-primary)',
                      color: 'var(--ai-color-text-primary)',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      transition: 'border-color 0.15s',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--ai-color-state-info)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--ai-color-border-heavy)';
                    }}
                  >
                    <option value="desktop">💻 Desktop (768px)</option>
                    <option value="tablet">📱 Tablet (640px)</option>
                    <option value="mobile">📱 Mobile (375px)</option>
                  </select>
                  <span style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--ai-color-text-secondary)',
                    fontSize: '9px',
                  }}>▼</span>
                </div>
              </div>

              {/* Debug Mode Toggle */}
              <button
                onClick={() => setDebugMode(debugMode === 'none' ? 'border' : 'none')}
                title="Toggle debug borders"
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: debugMode === 'border' ? 'var(--ai-color-state-error)' : 'var(--ai-color-border-heavy)',
                  background: debugMode === 'border' ? 'var(--ai-color-state-error-bg)' : 'var(--ai-color-bg-primary)',
                  color: debugMode === 'border' ? 'var(--ai-color-state-error)' : 'var(--ai-color-text-secondary)',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (debugMode !== 'border') {
                    e.currentTarget.style.borderColor = 'var(--ai-color-state-error)';
                    e.currentTarget.style.background = 'var(--ai-color-state-error-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (debugMode !== 'border') {
                    e.currentTarget.style.borderColor = 'var(--ai-color-border-heavy)';
                    e.currentTarget.style.background = 'var(--ai-color-bg-primary)';
                  }
                }}
              >
                🔍 Debug: {debugMode === 'border' ? 'ON' : 'OFF'}
              </button>

              {/* Spacer */}
              <div style={{ flex: 1, minWidth: '20px' }} />

              {/* Status Indicators */}
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: 'var(--ai-color-state-info-bg)',
                  color: 'var(--ai-color-state-info)',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.02em',
                }}>
                  {widgetState.toUpperCase()}
                </span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: 'var(--ai-color-border-light)',
                  color: 'var(--ai-color-text-secondary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: '1px solid var(--ai-color-border-light)',
                }}>
                  {mockTheme === 'dark' ? '🌙' : '☀️'} {mockTheme.toUpperCase()}
                </span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: 'var(--ai-state-hover-background)',
                  color: 'var(--ai-color-text-secondary)',
                  fontSize: '11px',
                  fontWeight: '600',
                }}>
                  {viewportWidth}px
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area - Viewport Constraint */}
      <div style={{
          maxWidth: `${viewportWidth}px`,
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          overflowX: 'hidden',
        }}>
          <ErrorBoundary>
            <AppsSDKUIProvider linkComponent="a">
              <ActiveComponent />
            </AppsSDKUIProvider>
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
  );
}