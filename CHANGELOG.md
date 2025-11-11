# Changelog

All notable changes to @ainativekit/devtools will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2025-01-11

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

## [0.1.0] - 2025-01-10

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

[Unreleased]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/releases/tag/v0.1.0