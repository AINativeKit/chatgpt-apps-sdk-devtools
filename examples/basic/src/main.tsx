import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppsSDKUIProvider } from '@ainativekit/ui';
import { DevContainer } from '@ainativekit/devtools';
import App from './App';

// Import styles - order matters!
// 1. Polyfill tokens + app styles (MUST come first to define --radius-* etc)
import './index.css';
// 2. OpenAI Apps SDK UI styles
import '@openai/apps-sdk-ui/css';
// 3. AINativeKit UI styles (extensions)
import '@ainativekit/ui/styles';

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
    <AppsSDKUIProvider linkComponent="a">
      <DevContainer
        dataLoader={() => mockData}
        loadingDelay={2000}
        theme="light"
        autoLoad={true}
        toolbarPosition="top"
      >
        <App />
      </DevContainer>
    </AppsSDKUIProvider>
  </React.StrictMode>
);