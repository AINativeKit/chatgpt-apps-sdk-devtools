# @ainativekit/devtools Examples

This directory contains examples demonstrating how to use @ainativekit/devtools with different types of ChatGPT widgets.

## 📚 Available Examples

### 1. Basic Example (`/basic`)
A minimal example showing the core setup for using DevContainer.

```tsx
import { DevContainer } from '@ainativekit/devtools';

<DevContainer>
  <YourWidget />
</DevContainer>
```

### 2. Multi-Widget Example (`/multi-widget`) (v0.2.0+)
Demonstrates the MultiWidgetRouter for managing multiple widgets in a single dev server.

```tsx
<MultiWidgetRouter
  widgets={[
    { id: 'carousel', name: 'Carousel', component: CarouselWidget },
    { id: 'map', name: 'Map', component: MapWidget },
    { id: 'search', name: 'Search', component: SearchWidget }
  ]}
  sharedConfig={{ loadingDelay: 2000, theme: 'light' }}
  dataLoaders={{ restaurants: () => mockData }}
  defaultWidget="carousel"
/>
```

**Features:**
- Widget switching with dropdown selector
- URL parameter support (`?widget=map`)
- Shared configuration across widgets
- Persistent widget selection
- createMockData utility usage

### 3. Advanced Example (`/advanced`)
Demonstrates advanced features like custom data loaders, empty states, and error handling.

```tsx
<DevContainer
  loadingDelay={3000}
  dataLoader={fetchMockData}
  emptyDataLoader={getEmptyState}
  theme="dark"
>
  <ComplexWidget />
</DevContainer>
```

## 🚀 Running Examples

### Install Dependencies
```bash
cd examples/basic
npm install
```

### Start Development Server
```bash
npm run dev
```

Visit http://localhost:5173 to see the example running.

## 💡 Common Use Cases

### Testing Loading States
```tsx
<DevContainer loadingDelay={5000}>
  <Widget />
</DevContainer>
```

### Testing Empty States
```tsx
<DevContainer
  emptyDataLoader={() => ({
    type: 'results',
    items: [],
    message: 'No results found'
  })}
>
  <SearchWidget />
</DevContainer>
```

### Testing Error States
Click the "Error" button in the dev toolbar to simulate error states.

### Testing Different Viewports
Use the device selector (Desktop/Tablet/Mobile) to test responsive designs.

### Testing Dark Mode
Toggle the theme button to switch between light and dark modes.

## 🔄 Creating Your Own Example

1. Copy the basic example as a starting point:
   ```bash
   cp -r examples/basic examples/my-widget
   ```

2. Update the package.json name:
   ```json
   {
     "name": "@ainativekit/devtools-example-my-widget"
   }
   ```

3. Modify src/main.tsx to include your widget:
   ```tsx
   import { MyWidget } from './MyWidget';

   <DevContainer>
     <MyWidget />
   </DevContainer>
   ```

4. Add your custom mock data:
   ```tsx
   const mockData = {
     // Your widget-specific data
   };

   <DevContainer dataLoader={() => mockData}>
     <MyWidget />
   </DevContainer>
   ```

## 📝 Example Components

### Search Widget Example
```tsx
function SearchWidgetExample() {
  const mockSearchResults = {
    type: 'search',
    query: 'test query',
    results: [
      { id: 1, title: 'Result 1', description: 'Description 1' },
      { id: 2, title: 'Result 2', description: 'Description 2' },
    ]
  };

  const emptyResults = {
    type: 'search',
    query: 'test query',
    results: []
  };

  return (
    <DevContainer
      dataLoader={() => mockSearchResults}
      emptyDataLoader={() => emptyResults}
      loadingDelay={2000}
    >
      <SearchWidget />
    </DevContainer>
  );
}
```

### Dashboard Widget Example
```tsx
function DashboardWidgetExample() {
  const mockDashboardData = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      type: 'dashboard',
      metrics: {
        users: 1234,
        revenue: 45678,
        growth: 12.5
      },
      charts: [/* chart data */]
    };
  };

  return (
    <DevContainer
      dataLoader={mockDashboardData}
      loadingDelay={3000}
      theme="light"
    >
      <DashboardWidget />
    </DevContainer>
  );
}
```

### Form Widget Example
```tsx
function FormWidgetExample() {
  const mockFormData = {
    type: 'form',
    fields: [
      { name: 'email', type: 'email', required: true },
      { name: 'message', type: 'textarea', required: false }
    ],
    submitUrl: '/api/submit'
  };

  return (
    <DevContainer
      dataLoader={() => mockFormData}
      autoLoad={true}
    >
      <FormWidget />
    </DevContainer>
  );
}
```

## 🎨 Testing Different States

### State Flow Testing
1. Start with Loading state (automatic with loadingDelay)
2. Click "Instant Data" to skip loading
3. Click "Empty" to test empty states
4. Click "Error" to test error handling
5. Click "Delayed Data" to re-trigger loading flow

### Theme Testing
- Toggle between light and dark themes
- Ensure your widget respects theme variables
- Check contrast and readability in both modes

### Responsive Testing
- Desktop: 768px width
- Tablet: 640px width
- Mobile: 375px width
- Check layout adjustments at each breakpoint

## 🐛 Debugging Tips

1. **Use Debug Borders**: Toggle the debug border to see widget boundaries
2. **Check Console**: DevContainer logs state changes for debugging
3. **Inspect window.openai**: The mock API is available in browser console
4. **Test Production Mode**: Remove DevContainer wrapper to test production behavior

## 📦 Publishing Your Widget

When your widget is ready for production:

1. Remove DevContainer from production code
2. Ensure your widget reads from real `window.openai`
3. Test in actual ChatGPT environment
4. Deploy your widget

Remember: DevContainer is for development only and should never be included in production builds!