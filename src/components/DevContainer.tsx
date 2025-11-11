import React, { useEffect, useState, useMemo } from 'react';
import { SetGlobalsEvent, type OpenAiGlobals, type Theme } from '@ainativekit/ui';
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

    // Load the data after delay
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
          background: mockTheme === 'dark'
            ? 'linear-gradient(to bottom, rgba(30,30,30,0.98), rgba(20,20,20,0.98))'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(250,250,250,0.98))',
          backdropFilter: 'blur(10px)',
          borderBottom: toolbarPosition === 'top'
            ? mockTheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
            : 'none',
          borderTop: toolbarPosition === 'bottom'
            ? mockTheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
            : 'none',
          padding: '12px 16px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: toolbarPosition === 'top'
            ? mockTheme === 'dark'
              ? '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.4)'
              : '0 4px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.08)'
            : mockTheme === 'dark'
              ? '0 -4px 12px rgba(0,0,0,0.3), 0 -1px 3px rgba(0,0,0,0.4)'
              : '0 -4px 12px rgba(0,0,0,0.05), 0 -1px 3px rgba(0,0,0,0.08)',
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
              borderRight: mockTheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              marginRight: '4px',
            }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              <span style={{
                fontWeight: '600',
                fontSize: '13px',
                color: mockTheme === 'dark' ? '#e5e5e5' : '#333',
                letterSpacing: '-0.01em',
              }}>
                Dev Tools
              </span>
            </div>

            {/* Widget Selector (only shown for multiple widgets) */}
            {showWidgetSelector && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <select
                  value={activeWidgetId}
                  onChange={(e) => setActiveWidgetId(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    paddingRight: '28px',
                    borderRadius: '6px',
                    border: mockTheme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
                    background: mockTheme === 'dark' ? '#2a2a2a' : 'white',
                    color: mockTheme === 'dark' ? '#e5e5e5' : '#333',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    minWidth: '140px',
                    appearance: 'none',
                    backgroundImage: mockTheme === 'dark'
                      ? 'url("data:image/svg+xml,%3Csvg width=\'8\' height=\'6\' viewBox=\'0 0 8 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L4 4.5L7 1.5\' stroke=\'%23aaa\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")'
                      : 'url("data:image/svg+xml,%3Csvg width=\'8\' height=\'6\' viewBox=\'0 0 8 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L4 4.5L7 1.5\' stroke=\'%23666\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = mockTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {normalizedWidgets.map(widget => (
                    <option key={widget.id} value={widget.id}>
                      {widget.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Data Loader Selector (if multiple) */}
            {Object.keys(normalizedDataLoaders).length > 1 && (
              <select
                value={activeDataLoader}
                onChange={(e) => setActiveDataLoader(e.target.value)}
                title="Select data source"
                style={{
                  padding: '5px 10px',
                  paddingRight: '28px',
                  borderRadius: '6px',
                  border: mockTheme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
                  background: mockTheme === 'dark' ? '#2a2a2a' : 'white',
                  color: mockTheme === 'dark' ? '#e5e5e5' : '#333',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '110px',
                  appearance: 'none',
                  backgroundImage: mockTheme === 'dark'
                    ? 'url("data:image/svg+xml,%3Csvg width=\'8\' height=\'6\' viewBox=\'0 0 8 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L4 4.5L7 1.5\' stroke=\'%23aaa\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")'
                    : 'url("data:image/svg+xml,%3Csvg width=\'8\' height=\'6\' viewBox=\'0 0 8 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L4 4.5L7 1.5\' stroke=\'%23666\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = mockTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {Object.keys(normalizedDataLoaders).map(key => (
                  <option key={key} value={key}>
                    📊 {key}
                  </option>
                ))}
              </select>
            )}

            {/* Separator */}
            <div style={{
              width: '1px',
              height: '20px',
              background: mockTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              margin: '0 4px',
            }} />

            {/* State Controls */}
            <div style={{
              display: 'flex',
              gap: '4px',
              background: mockTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
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
                  background: widgetState === 'loading' ? '#3b82f6' : 'transparent',
                  color: widgetState === 'loading' ? 'white' : (mockTheme === 'dark' ? '#aaa' : '#555'),
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: widgetState === 'loading' && !isLoading ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: (widgetState === 'loading' && !isLoading) ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (widgetState !== 'loading' && !e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                    e.currentTarget.style.color = '#3b82f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (widgetState !== 'loading') {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = mockTheme === 'dark' ? '#aaa' : '#555';
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
                  background: widgetState === 'data' && !isLoading ? '#10b981' : 'transparent',
                  color: widgetState === 'data' && !isLoading ? 'white' : (mockTheme === 'dark' ? '#aaa' : '#555'),
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: isLoading ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (widgetState !== 'data' && !e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'rgba(16,185,129,0.1)';
                    e.currentTarget.style.color = '#10b981';
                  }
                }}
                onMouseLeave={(e) => {
                  if (widgetState !== 'data' || isLoading) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = mockTheme === 'dark' ? '#aaa' : '#555';
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
                  color: mockTheme === 'dark' ? '#aaa' : '#555',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: isLoading ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'rgba(16,185,129,0.1)';
                    e.currentTarget.style.color = '#10b981';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = mockTheme === 'dark' ? '#aaa' : '#555';
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
                  background: widgetState === 'empty' ? '#f59e0b' : 'transparent',
                  color: widgetState === 'empty' ? 'white' : '#555',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: isLoading ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (widgetState !== 'empty' && !e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'rgba(245,158,11,0.1)';
                    e.currentTarget.style.color = '#f59e0b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (widgetState !== 'empty') {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = mockTheme === 'dark' ? '#aaa' : '#555';
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
                  background: widgetState === 'error' ? '#ef4444' : 'transparent',
                  color: widgetState === 'error' ? 'white' : '#555',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: isLoading ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (widgetState !== 'error' && !e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                    e.currentTarget.style.color = '#ef4444';
                  }
                }}
                onMouseLeave={(e) => {
                  if (widgetState !== 'error') {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = mockTheme === 'dark' ? '#aaa' : '#555';
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
              background: mockTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              margin: '0 4px',
            }} />

            {/* Theme Toggle */}
            <button
              onClick={() => setMockTheme(mockTheme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${mockTheme === 'light' ? 'dark' : 'light'} theme`}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: mockTheme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
                background: mockTheme === 'dark' ? '#2a2a2a' : 'white',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = mockTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = mockTheme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = mockTheme === 'dark' ? '#2a2a2a' : 'white';
                e.currentTarget.style.borderColor = mockTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
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
                background: showAdvancedSettings ? 'rgba(59,130,246,0.1)' : 'transparent',
                color: showAdvancedSettings ? '#3b82f6' : (mockTheme === 'dark' ? '#aaa' : '#666'),
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                if (!showAdvancedSettings) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = mockTheme === 'dark' ? '#aaa' : '#666';
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
              borderTop: mockTheme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
            }}>
              {/* Device Type */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ fontSize: '12px', color: mockTheme === 'dark' ? '#aaa' : '#666', fontWeight: '500' }}>Device:</span>
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value as 'desktop' | 'tablet' | 'mobile')}
                  style={{
                    padding: '4px 8px',
                    paddingRight: '24px',
                    borderRadius: '6px',
                    border: mockTheme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
                    background: mockTheme === 'dark' ? '#2a2a2a' : 'white',
                    color: mockTheme === 'dark' ? '#e5e5e5' : '#333',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: mockTheme === 'dark'
                      ? 'url("data:image/svg+xml,%3Csvg width=\'8\' height=\'6\' viewBox=\'0 0 8 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L4 4.5L7 1.5\' stroke=\'%23aaa\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")'
                      : 'url("data:image/svg+xml,%3Csvg width=\'8\' height=\'6\' viewBox=\'0 0 8 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L4 4.5L7 1.5\' stroke=\'%23666\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 6px center',
                    transition: 'border-color 0.15s',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = mockTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
                  }}
                >
                  <option value="desktop">💻 Desktop (768px)</option>
                  <option value="tablet">📱 Tablet (640px)</option>
                  <option value="mobile">📱 Mobile (375px)</option>
                </select>
              </div>

              {/* Debug Mode Toggle */}
              <button
                onClick={() => setDebugMode(debugMode === 'none' ? 'border' : 'none')}
                title="Toggle debug borders"
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: debugMode === 'border' ? '#ef4444' : (mockTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'),
                  background: debugMode === 'border' ? 'rgba(239,68,68,0.1)' : (mockTheme === 'dark' ? '#2a2a2a' : 'white'),
                  color: debugMode === 'border' ? '#ef4444' : (mockTheme === 'dark' ? '#aaa' : '#666'),
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (debugMode !== 'border') {
                    e.currentTarget.style.borderColor = '#ef4444';
                    e.currentTarget.style.background = 'rgba(239,68,68,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (debugMode !== 'border') {
                    e.currentTarget.style.borderColor = mockTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
                    e.currentTarget.style.background = mockTheme === 'dark' ? '#2a2a2a' : 'white';
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
                  background: 'rgba(59,130,246,0.1)',
                  color: '#3b82f6',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.02em',
                }}>
                  {widgetState.toUpperCase()}
                </span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: mockTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
                  color: mockTheme === 'dark' ? '#aaa' : '#666',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: mockTheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                }}>
                  {mockTheme === 'dark' ? '🌙' : '☀️'} {mockTheme.toUpperCase()}
                </span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: mockTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  color: mockTheme === 'dark' ? '#aaa' : '#666',
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