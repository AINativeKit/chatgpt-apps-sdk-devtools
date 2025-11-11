import React, { useEffect, useState } from 'react';
import { SetGlobalsEvent, type OpenAiGlobals, type Theme, Button, Chip } from '@ainativekit/ui';
import type { DevContainerProps } from '../types';

/**
 * DevContainer - Generic development environment simulator for ChatGPT widgets
 *
 * A completely generic, reusable testing tool for ANY ChatGPT widget.
 * Part of the @ainativekit/devtools package.
 *
 * This container simulates ChatGPT's production environment by:
 * 1. Mocking the window.openai API
 * 2. Using ChatGPT Apps SDK's SetGlobalsEvent for state updates
 * 3. Providing interactive controls for testing different states
 * 4. Simulating different viewport widths (desktop/tablet/mobile)
 * 5. Applying debug overlays externally (clean separation)
 *
 * Architecture:
 * - Widget components contain ZERO dev-specific code
 * - All debug tools are external to the widget
 * - Widget code is 100% production-ready
 * - Never included in production builds
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
  children,
  loadingDelay = 2000,
  theme: initialTheme = 'light',
  autoLoad = true,
  dataLoader,
  emptyDataLoader,
  showDevTools: _initialShowDevTools = true, // Kept for backward compatibility but always true
  toolbarPosition = 'top',
  widgetSelector,
}: DevContainerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [widgetState, setWidgetState] = useState<'loading' | 'data' | 'error' | 'empty'>('loading');
  const [isLoading, setIsLoading] = useState(false);
  const [showDevTools] = useState(true); // Always true - dev environment should always show tools
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Interactive controls state
  const [mockTheme, setMockTheme] = useState<Theme>(initialTheme);
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewportWidth, setViewportWidth] = useState<number>(768); // Desktop width by default
  const [debugMode, setDebugMode] = useState<'none' | 'border'>('none');

  // Sync theme to document root for page-level theming
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mockTheme);
    // Set body background to match theme using AINativeKit token
    // Get computed value after theme attribute is set
    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--ai-color-bg-primary')
      .trim();
    if (bgColor) {
      document.body.style.backgroundColor = bgColor;
    }
  }, [mockTheme]);

  // Set globals helper using ChatGPT Apps SDK's SetGlobalsEvent
  const setGlobals = (globals: Partial<OpenAiGlobals>) => {
    // Ensure window.openai exists before assigning
    if (!window.openai) {
      (window as any).openai = {};
    }

    // Update window.openai with new globals
    Object.assign(window.openai as any, globals);

    // Dispatch ChatGPT Apps SDK's SetGlobalsEvent for type safety
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

  // Initialize window.openai on mount
  useEffect(() => {
    console.log('🔧 [@ainativekit/devtools] Initializing dev environment...');

    // Initialize window.openai if not present
    if (!window.openai) {
      (window as any).openai = {};
    }

    // Mock OpenAI API methods (matching production ChatGPT behavior)
    (window as any).openai.callTool = async (name: string, args: Record<string, unknown>) => {
      console.log('🔧 [@ainativekit/devtools] callTool:', name, args);
      // In real ChatGPT, this would call the MCP server
      return { result: 'Mock tool result' };
    };

    (window as any).openai.sendFollowUpMessage = async ({ prompt }: { prompt: string }) => {
      console.log('🔧 [@ainativekit/devtools] sendFollowUpMessage:', prompt);
      // In real ChatGPT, this would send a message to the conversation
    };

    (window as any).openai.openExternal = ({ href }: { href: string }) => {
      console.log('🔧 [@ainativekit/devtools] openExternal:', href);
      window.open(href, '_blank');
    };

    (window as any).openai.setWidgetState = (state: any) => {
      console.log('🔧 [@ainativekit/devtools] setWidgetState:', state);
      // In real ChatGPT, this would persist state
    };

    // Set initial loading state
    setGlobals({
      theme: mockTheme,
      toolOutput: null, // null triggers loading state
      locale: 'en',
      maxHeight: window.innerHeight,
      userAgent: getUserAgent(deviceType)
    });

    setIsInitialized(true);

    // Auto-load data after initialization (like production ChatGPT)
    if (autoLoad) {
      console.log('🔧 [@ainativekit/devtools] Auto-loading data...');
      // Use setTimeout to ensure initialization is complete
      setTimeout(() => {
        handleLoadDataDelayed();
      }, 100);
    }
  }, []);

  // Update globals when theme or deviceType changes
  useEffect(() => {
    if (!isInitialized) return;

    console.log('🔧 [@ainativekit/devtools] Updating theme/device:', {
      mockTheme,
      deviceType
    });

    setGlobals({
      theme: mockTheme,
      userAgent: getUserAgent(deviceType),
      locale: 'en',
      maxHeight: window.innerHeight
    });
  }, [mockTheme, deviceType, isInitialized]);

  // Load mock data helper
  const loadMockData = async () => {
    if (dataLoader) {
      return await dataLoader();
    }

    // Default mock data if no custom loader provided
    return {
      type: 'default',
      message: 'No custom data loader provided. Add a dataLoader prop to DevContainer.',
      timestamp: new Date().toISOString()
    };
  };

  // Show loading state
  const handleShowLoading = () => {
    console.log('🔧 [@ainativekit/devtools] Showing loading state...');
    setWidgetState('loading');
    setIsLoading(false);

    setGlobals({
      theme: mockTheme,
      toolOutput: null,
      locale: 'en',
      maxHeight: window.innerHeight,
      userAgent: getUserAgent(deviceType)
    });
  };

  // Load data instantly (for quick testing)
  const handleLoadDataInstant = async () => {
    console.log('🔧 [@ainativekit/devtools] Loading data instantly...');
    setWidgetState('data');
    setIsLoading(false);

    try {
      const toolOutput = await loadMockData();

      console.log('✅ [@ainativekit/devtools] Data loaded:', {
        type: toolOutput?.type || 'unknown',
      });

      setGlobals({
        theme: mockTheme,
        toolOutput,
        locale: 'en',
        maxHeight: window.innerHeight,
        userAgent: getUserAgent(deviceType)
      });
    } catch (error) {
      console.error('❌ [@ainativekit/devtools] Failed to load mock data:', error);
      handleShowError();
    }
  };

  // Load data with delay (for testing loading states)
  const handleLoadDataDelayed = async () => {
    console.log(`🔧 [@ainativekit/devtools] Loading data with ${loadingDelay}ms delay...`);
    setIsLoading(true);
    setWidgetState('data'); // Set button state to 'data' immediately

    // Show loading state
    setGlobals({
      theme: mockTheme,
      toolOutput: null,
      locale: 'en',
      maxHeight: window.innerHeight,
      userAgent: getUserAgent(deviceType)
    });

    // Load data after delay
    setTimeout(async () => {
      try {
        const toolOutput = await loadMockData();

        console.log('✅ [@ainativekit/devtools] Data loaded:', {
          type: toolOutput?.type || 'unknown',
        });

        setIsLoading(false);
        setGlobals({
          theme: mockTheme,
          toolOutput,
          locale: 'en',
          maxHeight: window.innerHeight,
          userAgent: getUserAgent(deviceType)
        });
      } catch (error) {
        console.error('❌ [@ainativekit/devtools] Failed to load mock data:', error);
        setIsLoading(false);
        handleShowError();
      }
    }, loadingDelay);
  };

  // Show error state
  const handleShowError = () => {
    console.log('🔧 [@ainativekit/devtools] Showing error state...');
    setWidgetState('error');
    setIsLoading(false);

    setGlobals({
      theme: mockTheme,
      toolOutput: { error: 'Failed to load data. Please try again.' },
      locale: 'en',
      maxHeight: window.innerHeight,
      userAgent: getUserAgent(deviceType)
    });
  };

  // Show empty state
  const handleShowEmpty = async () => {
    console.log('🔧 [@ainativekit/devtools] Showing empty state...');
    setWidgetState('empty');
    setIsLoading(false);

    let emptyData;

    // Use the emptyDataLoader if provided by the client
    if (emptyDataLoader) {
      try {
        emptyData = await emptyDataLoader();
        console.log('✅ [@ainativekit/devtools] Empty data loaded from custom loader:', {
          type: emptyData?.type || 'unknown',
        });
      } catch (error) {
        console.error('❌ [@ainativekit/devtools] Failed to load empty data:', error);
        emptyData = { type: 'empty', message: 'No data available' };
      }
    } else {
      // Fallback: provide a minimal empty response
      console.log('ℹ️ [@ainativekit/devtools] No emptyDataLoader provided, using generic empty state');
      emptyData = {
        type: 'empty',
        message: 'No data available',
        info: 'Provide an emptyDataLoader prop to customize the empty state'
      };
    }

    setGlobals({
      theme: mockTheme,
      toolOutput: emptyData,
      locale: 'en',
      maxHeight: window.innerHeight,
      userAgent: getUserAgent(deviceType)
    });
  };

  if (!isInitialized) {
    return null;
  }

  const toolbar = (
    <div
      data-theme={mockTheme}
      style={{
        position: 'fixed',
        [toolbarPosition]: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--ai-color-bg-secondary)',
        color: 'var(--ai-color-text-primary)',
        borderBottom: toolbarPosition === 'top' ? '1px solid var(--ai-color-border-default)' : undefined,
        borderTop: toolbarPosition === 'bottom' ? '1px solid var(--ai-color-border-default)' : undefined,
        zIndex: 9999,
        boxShadow: toolbarPosition === 'top' ? '0 2px 8px rgba(0,0,0,0.15)' : '0 -2px 8px rgba(0,0,0,0.15)',
      }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '8px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        rowGap: '8px',
      }}>
        {/* Dev Tools Label */}
        <div style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--ai-color-text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>🛠️</span>
          <span>Dev Tools</span>
        </div>

        {/* Widget Selector (if provided) */}
        {widgetSelector && (
          <>
            {/* Separator */}
            <div style={{
              height: '20px',
              width: '1px',
              backgroundColor: 'var(--ai-color-border-heavy)',
            }} />
            {widgetSelector}
          </>
        )}

        {showDevTools && (
          <>
            {/* Separator */}
            <div style={{
              height: '20px',
              width: '1px',
              backgroundColor: 'var(--ai-color-border-heavy)',
            }} />

            {/* PRIMARY SECTION: Widget State */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--ai-color-text-tertiary)',
                fontWeight: '500',
                marginRight: '4px'
              }}>
                State:
              </span>
              <Chip
                size="sm"
                selected={widgetState === 'loading'}
                onClick={handleShowLoading}
                disabled={isLoading}
                title="Show loading state"
              >
                Loading
              </Chip>
              <Chip
                size="sm"
                variant={widgetState === 'data' && !isLoading ? 'success' : 'default'}
                selected={widgetState === 'data' && !isLoading}
                onClick={handleLoadDataInstant}
                disabled={isLoading}
                title="Load data instantly"
              >
                Instant
              </Chip>
              <Chip
                size="sm"
                variant={widgetState === 'data' && isLoading ? 'success' : 'default'}
                selected={widgetState === 'data' && isLoading}
                onClick={handleLoadDataDelayed}
                disabled={isLoading}
                title={`Load data with ${loadingDelay}ms delay`}
              >
                {isLoading && widgetState === 'data' ? '⏳' : 'Delayed'}
              </Chip>
              <Chip
                size="sm"
                selected={widgetState === 'empty'}
                onClick={handleShowEmpty}
                disabled={isLoading}
                title="Show empty state (no data)"
              >
                Empty
              </Chip>
              <Chip
                size="sm"
                variant={widgetState === 'error' ? 'error' : 'default'}
                selected={widgetState === 'error'}
                onClick={handleShowError}
                disabled={isLoading}
                title="Show error state"
              >
                Error
              </Chip>
            </div>

            {/* Separator */}
            <div style={{
              height: '20px',
              width: '1px',
              backgroundColor: 'var(--ai-color-border-heavy)',
            }} />

            {/* PRIMARY SECTION: Theme */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'nowrap' }}>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--ai-color-text-tertiary)',
                fontWeight: '500',
                marginRight: '4px'
              }}>
                Theme:
              </span>
              <Chip
                size="sm"
                leftIcon="color-theme"
                variant={mockTheme === 'light' ? 'success' : 'default'}
                selected={mockTheme === 'light'}
                onClick={() => setMockTheme('light')}
                title="Switch to light theme"
              >
                Light
              </Chip>
              <Chip
                size="sm"
                leftIcon="color-theme"
                variant={mockTheme === 'dark' ? 'success' : 'default'}
                selected={mockTheme === 'dark'}
                onClick={() => setMockTheme('dark')}
                title="Switch to dark theme"
              >
                Dark
              </Chip>
            </div>

            {/* Separator */}
            <div style={{
              height: '20px',
              width: '1px',
              backgroundColor: 'var(--ai-color-border-heavy)',
            }} />

            {/* Advanced Settings Toggle */}
            <Button
              variant={showAdvancedSettings ? 'primary' : 'tertiary'}
              leftIcon={showAdvancedSettings ? "chevron-down-md" : "chevron-right-md"}
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              title="Toggle advanced settings"
            >
              Advanced
            </Button>

            {/* ADVANCED SECTION: Second row when expanded */}
            {showAdvancedSettings && (
              <div style={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '8px',
                paddingTop: '8px',
                borderTop: '1px solid var(--ai-color-border-light)',
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--ai-color-text-tertiary)',
                  fontWeight: '500',
                  marginRight: '4px'
                }}>
                  Advanced:
                </span>

                {/* Device type & viewport width selector */}
                <select
                  value={deviceType}
                  onChange={(e) => {
                    const device = e.target.value as 'desktop' | 'tablet' | 'mobile';
                    setDeviceType(device);
                    // Auto-update viewport width based on device
                    if (device === 'desktop') setViewportWidth(768);
                    else if (device === 'tablet') setViewportWidth(640);
                    else setViewportWidth(375);
                  }}
                  title="Simulate different device types and viewport widths"
                  style={{
                    fontSize: '0.75rem',
                    backgroundColor: 'var(--ai-color-bg-tertiary)',
                    color: 'var(--ai-color-text-primary)',
                    border: '1px solid var(--ai-color-border-default)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    minWidth: '120px',
                  }}
                >
                  <option value="desktop">Desktop - 768px</option>
                  <option value="tablet">Tablet - 640px</option>
                  <option value="mobile">Mobile - 375px</option>
                </select>

                {/* Debug overlay toggle */}
                <Button
                  variant={debugMode !== 'none' ? 'primary' : 'tertiary'}
                  leftIcon="bug"
                  onClick={() => {
                    setDebugMode(debugMode === 'none' ? 'border' : 'none');
                  }}
                  title="Toggle debug overlay"
                >
                  {debugMode === 'border' ? 'Border On' : 'Debug'}
                </Button>

                {/* Generic debug info */}
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--ai-color-text-tertiary)',
                  display: 'flex',
                  gap: '12px',
                  marginLeft: '12px',
                }}>
                  {!!window.openai?.toolOutput?.type && (
                    <span>Type: <strong style={{ color: 'var(--ai-color-text-secondary)' }}>{String(window.openai.toolOutput.type)}</strong></span>
                  )}
                  {!!window.openai?.maxHeight && (
                    <span>Max Height: <strong style={{ color: 'var(--ai-color-text-secondary)' }}>{String(window.openai.maxHeight)}px</strong></span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Toolbar */}
      {toolbar}

      {/* Content area with padding */}
      <div style={{
        [toolbarPosition === 'top' ? 'paddingTop' : 'paddingBottom']: showAdvancedSettings ? '160px' : '100px',
        background: 'var(--ai-color-bg-primary)',
        minHeight: '100vh',
        transition: 'padding 0.2s ease'
      }}>
        {/* Apply viewport width constraint */}
        <div style={{
          maxWidth: `${viewportWidth}px`,
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          overflowX: 'hidden',
        }}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>

          {/* Debug border overlay */}
          {debugMode === 'border' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                border: '4px dashed rgba(239, 68, 68, 0.6)',
                boxSizing: 'border-box',
                zIndex: 9997,
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                padding: '2px 6px',
                fontSize: '0.75rem',
                fontWeight: '500',
              }}>
                Widget Boundary
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}