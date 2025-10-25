# Contributing to UnifiedAI

Thank you for your interest in contributing to UnifiedAI! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/43v3rAI-6.git
   cd 43v3rAI-6
   ```

2. **Run Setup Script**
   ```bash
   bash setup.sh
   ```

3. **Create Environment File**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

## Commit Convention

We use Conventional Commits:

```
feat: add Slack connector
fix: resolve database connection issue
docs: update API documentation
style: format code with prettier
refactor: restructure data engine
test: add tests for PostgreSQL connector
chore: update dependencies
```

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Add tests for new functionality
4. Run linter: `npm run lint`
5. Run tests: `npm test`
6. Update documentation if needed
7. Push to your fork
8. Create a Pull Request to `develop`

## Code Style

### TypeScript

- Use strict mode
- Prefer `const` over `let`
- Use async/await over promises
- Add JSDoc comments for public APIs
- Export types alongside implementations

Example:
```typescript
/**
 * Fetches data from a data source
 * @param sourceId - The ID of the data source
 * @param params - Optional fetch parameters
 * @returns Promise with data records
 */
export async function fetchData(
  sourceId: string,
  params?: FetchParams
): Promise<DataRecord[]> {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- TypeScript for all props
- Keep components small and focused
- Extract business logic to custom hooks

Example:
```typescript
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  // Implementation
};
```

### File Structure

```
services/data-engine/
├── src/
│   ├── index.ts              # Main export
│   ├── connectors/
│   │   ├── BaseConnector.ts  # Base class
│   │   └── GoogleDrive.ts    # Implementation
│   ├── types.ts              # Type definitions
│   └── utils.ts              # Utilities
├── tests/
│   └── connectors/
│       └── GoogleDrive.test.ts
├── package.json
└── tsconfig.json
```

## Testing Guidelines

### Unit Tests

```typescript
import { GoogleDriveConnector } from '../GoogleDrive';

describe('GoogleDriveConnector', () => {
  it('should connect successfully', async () => {
    const connector = new GoogleDriveConnector();
    const result = await connector.test();
    expect(result).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('Data Engine Integration', () => {
  it('should sync data from Google Drive', async () => {
    // Test full flow
  });
});
```

## Adding New Features

### Adding a Connector

1. Create file in `/services/data-engine/src/connectors/`
2. Extend `BaseConnector`
3. Implement required methods
4. Add tests
5. Update documentation

### Adding an AI Agent

1. Create agent in `/services/agentic-workspace/src/agents/`
2. Define capabilities and tools
3. Register in workspace
4. Add frontend UI
5. Document usage

### Adding Documentation

1. Update relevant `.md` files in `/docs`
2. Update `Claude.md` if needed
3. Add code examples
4. Update README if needed

## Documentation Standards

- Use clear, concise language
- Include code examples
- Add diagrams where helpful
- Keep it up to date

## Review Process

All PRs will be reviewed for:

1. **Code Quality**
   - Follows style guide
   - No unnecessary complexity
   - Proper error handling

2. **Tests**
   - Adequate test coverage
   - Tests pass

3. **Documentation**
   - Updated as needed
   - Clear commit messages

4. **Performance**
   - No obvious performance issues
   - Efficient algorithms

## Getting Help

- **Questions:** Open a GitHub Discussion
- **Bugs:** Open a GitHub Issue
- **Security:** Email security@unifiedai.com

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the golden rule

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing to UnifiedAI! 🎉
