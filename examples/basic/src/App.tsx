import React from 'react';
import { useGlobals } from '@ainativekit/ui';

/**
 * Example ChatGPT Widget
 * This demonstrates how to build a widget that works with @ainativekit/devtools
 */
function App() {
  const { globals } = useGlobals();
  const { toolOutput, theme } = globals || {};

  // Show loading state
  if (!toolOutput) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading...</h2>
        <p>Waiting for data from DevContainer...</p>
      </div>
    );
  }

  // Show error state
  if (toolOutput.error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>{toolOutput.error}</p>
      </div>
    );
  }

  // Show data
  return (
    <div style={{
      padding: '20px',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      minHeight: '400px',
      borderRadius: '8px',
      margin: '20px',
    }}>
      <h1>Example ChatGPT Widget</h1>
      <p>This widget is wrapped with @ainativekit/devtools for development.</p>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f5f5f5',
        borderRadius: '4px',
      }}>
        <h3>Current State:</h3>
        <ul>
          <li>Theme: <strong>{theme}</strong></li>
          <li>Data Type: <strong>{toolOutput.type || 'default'}</strong></li>
          <li>Timestamp: <strong>{toolOutput.timestamp || 'N/A'}</strong></li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f5f5f5',
        borderRadius: '4px',
      }}>
        <h3>Tool Output:</h3>
        <pre style={{
          fontSize: '12px',
          overflow: 'auto',
          maxHeight: '200px',
        }}>
          {JSON.stringify(toolOutput, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => {
            if (window.openai?.sendFollowUpMessage) {
              window.openai.sendFollowUpMessage({
                prompt: 'User clicked the button!'
              });
            }
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: theme === 'dark' ? '#4a4a4a' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Test OpenAI API
        </button>
      </div>
    </div>
  );
}

export default App;