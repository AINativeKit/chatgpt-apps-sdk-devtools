# @ainativekit/devtools

> Development tools for ChatGPT Apps using AINativeKit

[![npm version](https://img.shields.io/npm/v/@ainativekit/devtools.svg)](https://www.npmjs.com/package/@ainativekit/devtools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful, zero-configuration development environment for building ChatGPT apps. Simulate the ChatGPT production environment locally with interactive controls for testing different states, themes, and device types.

## ✨ Features

- 🎭 **Mock ChatGPT Environment** - Simulates `window.openai` API exactly like production
- 🎨 **Theme Switching** - Test light and dark themes instantly
- 📱 **Device Simulation** - Desktop (768px), Tablet (640px), Mobile (375px) viewports
- 🔄 **State Testing** - Loading, data, and error states with customizable delays
- 🐛 **Debug Overlays** - Visual boundary indicators for development
- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 📦 **Production Ready** - Clean separation between dev tools and widget code
- 🔌 **AINativeKit Integration** - Uses official AINativeKit hooks and events

## 📦 Installation

```bash
npm install --save-dev @ainativekit/devtools
```

or with yarn:

```bash
yarn add -D @ainativekit/devtools
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { DevContainer } from '@ainativekit/devtools';
import { ThemeProvider } from '@ainativekit/ui';
import App from './App';

// Only use DevContainer in development
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider>
    {import.meta.env.DEV ? (
      <DevContainer>
        <App />
      </DevContainer>
    ) : (
      <App />
    )}
  </ThemeProvider>
);
```

### With Custom Data Loader

```typescript
<DevContainer
  dataLoader={async () => {
    // Return your widget-specific mock data
    const response = await fetch('/api/mock-data');
    return response.json();
  }}
  loadingDelay={3000} // Test loading states
  theme="dark" // Start with dark theme
>
  <YourWidget />
</DevContainer>
```

## 📖 API Reference

### DevContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Your widget or app component |
| `loadingDelay` | `number` | `2000` | Delay (ms) before loading data |
| `theme` | `'light' \| 'dark'` | `'light'` | Initial theme |
| `autoLoad` | `boolean` | `true` | Auto-load data on mount |
| `dataLoader` | `() => Promise<any> \| any` | - | Custom data loader function |
| `emptyDataLoader` | `() => Promise<any> \| any` | - | Custom empty state data loader |
| `showDevTools` | `boolean` | `true` | Show/hide dev toolbar |
| `toolbarPosition` | `'top' \| 'bottom'` | `'top'` | Toolbar position |

### Mock OpenAI API

The DevContainer automatically mocks the `window.openai` API with these methods:

```typescript
window.openai = {
  callTool: async (name, args) => { /* mocked */ },
  sendFollowUpMessage: async ({ prompt }) => { /* mocked */ },
  openExternal: ({ href }) => { /* mocked */ },
  setWidgetState: (state) => { /* mocked */ },
  // Plus all OpenAiGlobals properties
  theme: 'light' | 'dark',
  toolOutput: any,
  locale: string,
  maxHeight: number,
  userAgent: { device: { type }, capabilities: { hover, touch } }
}
```

## 🎮 Interactive Controls

### Toolbar Features

- **State Controls**: Switch between Loading, Instant Data, Delayed Data, Empty, and Error states
- **Theme Toggle**: Switch between light and dark themes
- **Device Simulation**: Test desktop, tablet, and mobile viewports
- **Debug Border**: Toggle visual boundary indicators
- **Collapsible UI**: Hide/show dev tools with a single click

## 💡 Common Patterns

### Testing Loading States

```typescript
<DevContainer
  loadingDelay={5000} // 5 second delay
  dataLoader={async () => {
    // Simulate slow API
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { data: 'loaded' };
  }}
>
  <App />
</DevContainer>
```

### Testing Empty States

```typescript
<DevContainer
  emptyDataLoader={() => {
    // Return widget-specific empty state
    return {
      type: 'search-results',
      properties: [],
      searchInfo: { totalResults: 0, location: 'Sydney, NSW' }
    };
  }}
  dataLoader={async () => {
    // Regular data when not in empty state
    return await fetchMockData();
  }}
>
  <SearchWidget />
</DevContainer>
```

### Testing Error States

```typescript
<DevContainer
  dataLoader={() => {
    // Return error data
    return { error: 'Something went wrong' };
  }}
>
  <App />
</DevContainer>
```

### Custom Mock Data

```typescript
// mockData.ts
export const mockSearchResults = {
  type: 'search-results',
  items: [
    { id: 1, title: 'Result 1' },
    { id: 2, title: 'Result 2' }
  ]
};

// App.tsx
import { mockSearchResults } from './mockData';

<DevContainer
  dataLoader={() => mockSearchResults}
>
  <SearchWidget />
</DevContainer>
```

## 🏗 Architecture

The DevContainer follows these principles:

1. **Zero Widget Contamination** - Your widget code contains no dev-specific logic
2. **Production Parity** - Uses the same APIs as production ChatGPT
3. **External Debugging** - All debug overlays are applied from outside the widget
4. **Type Safety** - Full TypeScript support with AINativeKit types
5. **Clean Separation** - Dev tools are never included in production builds

## 🔧 Development

### Building the Package

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Type Checking

```bash
npm run type-check
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Jake Lin

## 🔗 Links

- [GitHub Repository](https://github.com/AINativeKit/chatgpt-apps-sdk-devtools)
- [NPM Package](https://www.npmjs.com/package/@ainativekit/devtools)
- [AINativeKit](https://www.npmjs.com/package/@ainativekit/ui)
- [ChatGPT Apps Documentation](https://platform.openai.com/docs/chatgpt)

## 🙏 Acknowledgments

Built with ❤️ for the ChatGPT app developer community. Special thanks to the AINativeKit team for providing the foundation for ChatGPT app development.