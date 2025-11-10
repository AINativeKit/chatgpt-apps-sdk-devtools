# Changelog

All notable changes to @ainativekit/devtools will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Empty state support with `emptyDataLoader` prop
- Comprehensive TypeScript documentation
- CONTRIBUTING.md guide for contributors
- Additional examples in README

### Fixed
- DevContainer padding adjustments for Advanced section
- Theme-aware background colors using CSS variables
- Dev Tools visibility (always visible, removed close button)

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

[Unreleased]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/AINativeKit/chatgpt-apps-sdk-devtools/releases/tag/v0.1.0