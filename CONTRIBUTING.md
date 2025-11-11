# Contributing to @ainativekit/devtools

Thank you for your interest in contributing to @ainativekit/devtools! We welcome contributions from the community and are excited to work with you.

## 🚀 Getting Started

1. **Fork the repository**
   - Click the "Fork" button at the top of the GitHub page
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR-USERNAME/devtools.git
     cd devtools
     ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development mode**
   ```bash
   npm run dev
   ```

## 🔧 Development Workflow

### Building the Package
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Testing Your Changes
1. Build the package: `npm run build`
2. Link locally: `npm link`
3. In your test project: `npm link @ainativekit/devtools`
4. Import and use the DevContainer to test your changes

### Running Examples
```bash
cd examples/basic
npm install
npm run dev
```

## 📝 Pull Request Guidelines

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add JSDoc comments for new functions
   - Update TypeScript types as needed

3. **Test thoroughly**
   - Ensure `npm run build` succeeds
   - Ensure `npm run type-check` passes
   - Test with a real ChatGPT app if possible

4. **Update documentation**
   - Update README.md if adding new features
   - Add examples for new functionality
   - Update type definitions

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

### Submitting the PR

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template

3. **PR Description Should Include:**
   - What changes were made
   - Why the changes are needed
   - How to test the changes
   - Screenshots (if UI changes)

## 🏗 Architecture Guidelines

### Key Principles

1. **Zero Widget Contamination**
   - Dev tools should never affect production widget code
   - All debug features must be external to the widget

2. **Generic Implementation**
   - DevContainer should work with ANY ChatGPT widget
   - Avoid widget-specific logic in core components

3. **AINativeKit Compatibility**
   - Use official AINativeKit hooks and events
   - Follow AINativeKit design patterns

4. **Type Safety**
   - All exports must be properly typed
   - Use TypeScript strict mode

### File Structure
```
src/
├── components/       # React components
│   └── DevContainer.tsx
├── types/           # TypeScript definitions
│   └── index.ts
└── index.ts         # Main exports
```

## 🐛 Reporting Issues

### Before Filing an Issue
- Check existing issues to avoid duplicates
- Try to reproduce with the latest version
- Gather relevant information (browser, OS, error messages)

### Creating an Issue
1. Use the issue templates if available
2. Provide a clear title and description
3. Include steps to reproduce
4. Add code examples if relevant
5. Include error messages and screenshots

## 💡 Feature Requests

We love new ideas! To request a feature:

1. Check if it's already requested
2. Open an issue with `[Feature Request]` prefix
3. Describe the use case
4. Explain the expected behavior
5. Provide examples if possible

## 📋 Code Style

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing formatting (2 spaces, no semicolons in TS)
- Use meaningful variable names
- Add JSDoc comments for public APIs

### React Components
- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic to custom hooks
- Use proper TypeScript types for props

### CSS
- Use CSS variables from AINativeKit
- Follow BEM naming convention for custom classes
- Keep styles scoped to components

## 🔄 Release Process

Maintainers will handle releases following semantic versioning:
- **Major (1.0.0)**: Breaking changes
- **Minor (0.1.0)**: New features (backward compatible)
- **Patch (0.0.1)**: Bug fixes

## 📚 Resources

- [AINativeKit UI](https://github.com/AINativeKit/chatgpt-apps-sdk-ui)
- [ChatGPT Apps Documentation](https://platform.openai.com/docs/chatgpt)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

## 🙏 Recognition

Contributors will be recognized in:
- The project README
- Release notes
- GitHub contributors page

## ❓ Questions?

- Open an issue with `[Question]` prefix
- Check existing issues and discussions
- Reach out to maintainers

Thank you for contributing to @ainativekit/devtools! 🚀