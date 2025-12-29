# @ainativekit/devtools

> Development tools for building and testing ChatGPT Apps using ChatGPT Apps SDK

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
- 🔌 **ChatGPT Apps SDK Compatible** - Works with any ChatGPT Apps SDK implementation

## 📋 Requirements

- **React** 18.0.0 or higher
- **Node.js** 18.0.0 or higher
- **Modern browser** with ES2020+ support
  - Chrome 80+, Firefox 75+, Safari 13.1+, Edge 80+

### Optional Dependencies

- **@ainativekit/ui** 1.0.0 or higher (optional, but recommended for enhanced theming)
  - DevTools includes basic theme support out of the box
  - For full design system integration, install `@ainativekit/ui` and use `AppsSDKUIProvider`
  - See usage examples below for both standalone and integrated approaches

## 📦 Installation

```bash
npm install --save-dev @ainativekit/devtools
```

or with yarn:

```bash
yarn add -D @ainativekit/devtools
```

## 🚀 Quick Start

### Standalone Usage (No Dependencies)

DevTools works out of the box with built-in theme support:

```typescript
import { DevContainer } from '@ainativekit/devtools';
import App from './App';

// Only use DevContainer in development
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  import.meta.env.DEV ? (
    <DevContainer>
      <App />
    </DevContainer>
  ) : (
    <App />
  )
);
```

### Enhanced Usage (with @ainativekit/ui)

For full design system integration and advanced theming:

```typescript
import { DevContainer } from '@ainativekit/devtools';
import { ThemeProvider } from '@ainativekit/ui';
import App from './App';

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

### Multiple Widgets with Widget-Specific Data Loaders (v1.0.0+)

DevContainer automatically detects when you have multiple widgets and shows a selector. Each widget can have its own data loader:

```typescript
import { DevContainer } from '@ainativekit/devtools';
import { AppsSDKUIProvider } from '@ainativekit/ui';
import CarouselWidget from './widgets/CarouselWidget';
import MapWidget from './widgets/MapWidget';
import ListWidget from './widgets/ListWidget';
import AlbumWidget from './widgets/AlbumWidget';

function App() {
  return (
    <AppsSDKUIProvider linkComponent="a">
      <DevContainer
        widgets={[
          {
            id: 'carousel',
            name: 'Pizza Carousel',
            component: CarouselWidget,
            dataLoader: () => carouselData,
            emptyDataLoader: () => emptyCarouselData
          },
          {
            id: 'map',
            name: 'Pizza Map',
            component: MapWidget,
            dataLoader: () => mapData
          },
          {
            id: 'list',
            name: 'Pizza List',
            component: ListWidget,
            dataLoader: () => listData,
            emptyDataLoader: () => emptyListData
          },
          {
            id: 'album',
            name: 'Photo Albums',
            component: AlbumWidget,
            dataLoader: () => albumData
          }
        ]}
        loadingDelay={1500}
        theme="light"
        autoLoad={true}
        defaultWidget="carousel"
      />
    </AppsSDKUIProvider>
  );
}
```

**Features:**
- Single dev server for all widgets
- Widget-specific data loaders (v1.0.0+)
- Automatic widget selector (only shows when multiple widgets)
- URL support (`?widget=map`) for deep linking
- Persistent widget selection
- Auto-reload data when switching widgets

## 📖 API Reference

### DevContainer Props

#### Single Widget Mode
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Single widget component |
| `dataLoader` | `() => Promise<any> \| any` | - | Data loader function |
| `emptyDataLoader` | `() => Promise<any> \| any` | - | Empty state data loader |

#### Multi-Widget Mode
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `widgets` | `Widget[]` | - | Array of widget configurations |
| `dataLoaders` | `Record<string, Function>` | `{}` | Map of global data loader functions |
| `emptyDataLoaders` | `Record<string, Function>` | `{}` | Map of global empty data loader functions |
| `defaultDataLoader` | `string` | - | Key for default data loader |
| `defaultWidget` | `string` | - | ID of default widget to show |

#### Widget Type (v1.0.0+)
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the widget |
| `name` | `string` | Yes | Display name for the widget selector |
| `component` | `React.ComponentType` | Yes | The widget component |
| `dataLoader` | `() => Promise<any> \| any` | No | Widget-specific data loader |
| `emptyDataLoader` | `() => Promise<any> \| any` | No | Widget-specific empty state data loader |

#### Common Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loadingDelay` | `number` | `2000` | Delay (ms) before loading data |
| `theme` | `'light' \| 'dark'` | `'light'` | Initial theme |
| `autoLoad` | `boolean` | `true` | Auto-load data on mount |

### createMockData

```typescript
createMockData<T>(fullData: T, config?: MockDataConfig<T>): MockData<T>
```

Creates type-safe mock data with automatic empty state generation.

**Config Options:**
- `emptyData`: Explicit empty state data
- `emptyTransform`: Function to derive empty state from full data
- If neither provided, generates empty object automatically

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
2. **Production Parity** - Uses the same APIs as production ChatGPT Apps
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
- [AINativeKit - ChatGPT Apps SDK UI](https://github.com/AINativeKit/chatgpt-apps-sdk-ui)
- [ChatGPT Apps Documentation](https://platform.openai.com/docs/chatgpt)

## 🙏 Acknowledgments

Built with ❤️ for the ChatGPT app developer community. This tool helps developers build and test ChatGPT Apps using the ChatGPT Apps SDK, making development faster and more enjoyable.