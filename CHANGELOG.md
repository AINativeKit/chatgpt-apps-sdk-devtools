# Changelog

All notable changes to @ainativekit/devtools will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2025-01-11

### Added
- **MultiWidgetRouter component** - Manage multiple widgets in a single dev server with an elegant dropdown selector
  - URL parameter support (`?widget=carousel`) for direct linking
  - localStorage persistence of selected widget
  - Browser back/forward navigation support
  - Shared DevContainer configuration across all widgets
  - Centralized data loader management
- **createMockData utility** - Type-safe mock data management with automatic empty state generation
  - Full TypeScript generics support
  - Three ways to define empty states (explicit, transform, auto-generated)
  - Works with any data structure
- **Empty state support** - New empty state testing in DevContainer
  - `emptyDataLoader` prop for custom empty state data
  - "Empty" button in toolbar for quick state switching
  - Complete coverage of all common widget states
- **widgetSelector prop** - Custom widget selector integration in DevContainer toolbar
  - Enables seamless MultiWidgetRouter integration
  - Maintains clean separation of concerns
- **Enhanced theme support** - Better full-page theming
  - Body background syncs with theme using CSS variables
  - Improved computed style detection
- **Error Boundary** - Graceful error handling for widget crashes
  - Shows friendly error message with details
  - Reset button to recover from errors
  - Prevents entire dev environment from crashing

### Fixed
- DevContainer padding adjustments for Advanced section
- Theme-aware background colors using CSS variables
- Dev Tools visibility (always visible, removed close button)
- Type duplication in DevContainer (now imports from types/index.ts)

### Documentation
- Comprehensive TypeScript documentation for all new components
- JSDoc comments with examples for all exports
- Inline documentation for complex logic
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