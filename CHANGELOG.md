# Changelog

All notable changes to @ainativekit/devtools will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-01-01

### Added
- **Data loader persistence** - Selected data loader (sunny, rainy, etc.) now persists to localStorage
- **Auto-load on change** - Data automatically loads when switching data loader or widget dropdown (shows loading state first)
- **Widget state exposure** - `window.openai.widgetState` now exposes current state ('loading' | 'data' | 'empty' | 'error') to widgets
  - Enables widgets to adapt behavior based on dev tool state
  - Dispatches `openai:widgetState` custom event when state changes

### Changed
- Widget/data loader change now uses delayed loading (shows skeleton) instead of instant load
- **Viewport breakpoints aligned with OpenAI Apps SDK** - Updated to match official breakpoint definitions:
  - Tablet: 640px → 576px (sm breakpoint)
  - Mobile: 375px → 380px (xs breakpoint)
  - Desktop: unchanged at 768px (md breakpoint)

## [1.0.0] - 2025-12-29

### Stable Release
First stable release of @ainativekit/devtools, aligned with @ainativekit/ui v1.0.0.

### Added
- **Widget-specific data loaders** - Each widget can now define its own data loader
  - `dataLoader` and `emptyDataLoader` props on Widget type
  - Auto-reload data when switching to widgets with their own loaders
  - Hide global data loader dropdown when widget has its own loader
- **Beautiful example widgets** - 4 production-ready example widgets
  - Pizza Carousel - SummaryCard with compact mode
  - Pizza Map - Interactive map with fullscreen support
  - Pizza List - Ranked list with interactive selection
  - Photo Albums - Album carousel with fullscreen viewer

### Changed
- **@ainativekit/ui peer dependency** - Updated to ^1.0.0
- **Toolbar positioning** - Changed from fixed to static positioning
  - Toolbar no longer floats over content
  - Removed `toolbarPosition` prop (always at top)
  - Better compatibility with fullscreen components

### Fixed
- Fullscreen map mode no longer blocked by floating toolbar
- Removed unused wrapper div in content area

### Examples
- Tailwind v4 configured for basic example
- Widgets example showcases @ainativekit/ui v1.0.0 components
- All widgets use widget-specific data loaders pattern

## [0.3.0] - 2025-11-11

### Major Improvements
- **@ainativekit/ui is now optional** - DevTools works standalone without requiring @ainativekit/ui
  - Includes minimal built-in theme support (~2KB CSS)
  - Auto-detects and enhances when @ainativekit/ui is available
  - Zero-configuration experience for both standalone and enhanced usage

### Added
- **Built-in theme CSS** - Minimal design system CSS variables bundled with DevTools
  - Essential color variables (bg, text, icon, border, brand)
  - Light and dark theme support via `data-theme` attribute
  - Covers all DevTools UI components and common widget patterns
- **Optional peer dependency support** - Uses `peerDependenciesMeta` to mark @ainativekit/ui as optional
  - npm/yarn/pnpm won't warn if @ainativekit/ui is not installed
  - Works with modern package managers (npm 7+, yarn 2+, pnpm 6+)

### Changed
- **@ainativekit/ui dependency** - Changed from required to optional peer dependency
  - Still recommended for full design system integration
  - DevTools provides basic theming without it
  - No breaking changes for existing users

### Documentation
- Updated README with standalone and enhanced usage examples
- Clarified @ainativekit/ui is optional but recommended
- Added comparison between standalone and enhanced modes
- Updated requirements section to reflect optional dependencies

### Bundle Size
- Standalone mode: ~2KB CSS overhead for theme support
- Enhanced mode: Same as before when using @ainativekit/ui
- No runtime performance impact

## [0.2.0] - 2025-11-11

### Major Improvements
- **Unified DevContainer** - Single component handles both single and multiple widgets elegantly
  - Automatic detection: no selector for single widget, dropdown for multiple
  - Cleaner API with intelligent defaults
  - Backward-compatible single widget mode via `children` prop
  - Multi-widget mode via `widgets` array

### Added
- **Multi-widget support** - Manage multiple widgets in a single dev server
  - URL parameter support (`?widget=carousel`) for direct linking
  - localStorage persistence of selected widget
  - Browser back/forward navigation support
  - Multiple data loader management
- **createMockData utility** - Type-safe mock data management
  - Full TypeScript generics support
  - Three ways to define empty states (explicit, transform, auto-generated)
  - Works with any data structure
- **Empty state support** - Complete widget state coverage
  - `emptyDataLoader` prop for custom empty state data
  - "Empty" button in toolbar for quick state switching
  - Support for both single and multi-widget modes
- **Enhanced theme support** - Better full-page theming
  - Body background syncs with theme using CSS variables
  - Improved computed style detection
- **Error Boundary** - Graceful error handling for widget crashes
  - Shows friendly error message with details
  - Reset button to recover from errors
  - Prevents entire dev environment from crashing

### Architecture Changes
- Removed separate MultiWidgetRouter component
- Unified all functionality into a single, intelligent DevContainer
- Simplified exports - just DevContainer and createMockData
- Cleaner type definitions with better organization

### Fixed
- WidgetState type now includes 'empty' state
- Theme-aware background colors using CSS variables
- Dev Tools visibility (always visible, removed close button)
- Type duplication removed (now imports from types/index.ts)

### Documentation
- Updated for cleaner, unified API
- Better examples showing both single and multi-widget usage
- Comprehensive TypeScript documentation
- Updated package description for broader ChatGPT Apps SDK scope

## [0.1.0] - 2025-11-10

### Added
- Initial release of @ainativekit/devtools
- `DevContainer` component for ChatGPT app development
- Mock `window.openai` API for local development
- Interactive state controls (Loading, Data, Empty, Error)
- Theme switching (Light/Dark)
- Device viewport simulation (Desktop/Tablet/Mobile)
- Debug border overlays
- Custom data loader support
- Zero-configuration setup
- Full TypeScript support
- AINativeKit integration using official hooks and events
- Production-ready architecture with clean separation

### Features
- **State Testing**: Switch between different widget states instantly
- **Theme Support**: Test light and dark themes with one click
- **Responsive Testing**: Simulate different device viewports
- **Debug Tools**: Visual boundaries for development
- **Type Safety**: Full TypeScript definitions and exports
- **Generic Design**: Works with any ChatGPT widget

### Documentation
- Comprehensive README with examples
- API reference for all props
- Common patterns and use cases
- Architecture principles
- MIT License

[Unreleased]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/releases/tag/v0.1.0