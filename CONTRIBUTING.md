# Contributing to Rest Express

Thank you for your interest in contributing to Rest Express! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/rest-express.git
   cd rest-express
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up your development environment** following the README.md

## 🔧 Development Process

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Use clear, descriptive commit messages:
```
feat: add multi-language support for checkout
fix: resolve cart quantity update issue
docs: update deployment instructions
refactor: improve analytics tracking performance
```

## 🧪 Testing

Before submitting a pull request:

1. **Run the test suite**:
   ```bash
   npm test
   ```

2. **Test your changes manually**:
   ```bash
   npm run dev
   ```

3. **Check TypeScript compilation**:
   ```bash
   npm run build
   ```

## 📝 Code Style

We use TypeScript and follow these conventions:

- **Use TypeScript** for all new code
- **Follow existing code patterns** in the project
- **Use meaningful variable and function names**
- **Add JSDoc comments** for complex functions
- **Keep components focused** and single-responsibility

### Example:
```typescript
/**
 * Calculates shipping cost based on location and cart total
 * @param location - User's shipping location
 * @param cartTotal - Total cart value
 * @returns Shipping cost in dollars
 */
export function calculateShipping(location: Location, cartTotal: number): number {
  // Implementation
}
```

## 🎯 Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** with clear, focused commits
3. **Update documentation** if needed
4. **Add tests** for new functionality
5. **Ensure all tests pass**
6. **Submit a pull request** with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots for UI changes

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] New tests added (if applicable)

## Screenshots (if applicable)
[Add screenshots here]
```

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Clear title** describing the problem
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Environment details** (OS, browser, Node version)
5. **Screenshots or error logs** if applicable

## 💡 Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** and use case clearly
3. **Explain the benefit** to users
4. **Consider backwards compatibility**

## 🏗 Project Structure

Understanding the codebase:

```
rest-express/
├── client/src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React state management
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page-level components
│   └── lib/            # Utilities and helpers
├── server/
│   ├── routes.ts       # API endpoint definitions
│   ├── storage.ts      # Database operations
│   └── __tests__/      # Backend test files
└── shared/
    ├── schema.ts       # Type definitions
    └── translations.ts # Internationalization
```

## 🌍 Internationalization

When adding new UI text:

1. **Add to translations file**:
   ```typescript
   // shared/translations.ts
   export const translations = {
     en: {
       'new.feature.title': 'New Feature',
     },
     // Add to all supported languages
   };
   ```

2. **Use in components**:
   ```typescript
   const { t } = useLanguage();
   return <h1>{t('new.feature.title')}</h1>;
   ```

## 📊 Analytics

When adding analytics tracking:

1. **Use existing analytics hooks**:
   ```typescript
   const { trackCartEvent } = useAnalytics();
   trackCartEvent('add', productId, quantity, price);
   ```

2. **Follow privacy guidelines**
3. **Document what data is tracked**

## 🎨 UI/UX Guidelines

- **Follow existing design patterns**
- **Use shadcn/ui components** when possible
- **Maintain responsive design**
- **Test on mobile devices**
- **Consider accessibility** (WCAG guidelines)

## 🔒 Security

- **Never commit sensitive data** (API keys, passwords)
- **Use environment variables** for configuration
- **Validate all user inputs**
- **Follow security best practices**

## 📚 Documentation

When contributing:

- **Update README.md** for new features
- **Add inline code comments** for complex logic
- **Update API documentation** for endpoint changes
- **Include examples** where helpful

## 🏆 Recognition

Contributors will be acknowledged in:
- GitHub contributors page
- Release notes for significant contributions
- Project documentation

## ❓ Questions?

- **Open a Discussion** on GitHub for general questions
- **Join our community** (if applicable)
- **Review existing issues** and pull requests

Thank you for contributing to Rest Express!