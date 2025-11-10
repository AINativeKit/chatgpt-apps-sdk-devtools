import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@ainativekit/ui';
import { DevContainer } from '@ainativekit/devtools';
import App from './App';

// Example mock data
const mockData = {
  type: 'example-data',
  message: 'Hello from @ainativekit/devtools!',
  timestamp: new Date().toISOString(),
  items: [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
    { id: 3, name: 'Item 3', value: 300 },
  ],
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <DevContainer
        dataLoader={() => mockData}
        loadingDelay={2000}
        theme="light"
        autoLoad={true}
        showDevTools={true}
        toolbarPosition="top"
      >
        <App />
      </DevContainer>
    </ThemeProvider>
  </React.StrictMode>
);