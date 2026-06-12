# Test-Driven Development (TDD) Guide

## What is TDD?

Test-Driven Development is a software development methodology where you write tests **before** writing the implementation code. The workflow follows three phases:

### The TDD Cycle: Red → Green → Refactor

```
┌─────────────────────────────────────────────┐
│         RED: Write Failing Tests            │
│  - Write tests for the desired behavior     │
│  - Tests fail because feature doesn't exist │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│    GREEN: Write Minimal Implementation      │
│  - Write just enough code to pass tests     │
│  - Don't over-engineer or add extras        │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│  REFACTOR: Improve Code Quality            │
│  - Clean up code while keeping tests green  │
│  - Optimize performance and readability     │
└─────────────┬───────────────────────────────┘
              │
              └──────→ Repeat for next feature
```

## Benefits of TDD

✅ **Better Design**: Forces you to think about the API before implementing  
✅ **Fewer Bugs**: Comprehensive test coverage catches issues early  
✅ **Faster Debugging**: Tests pinpoint exactly what broke  
✅ **Confidence**: Refactor safely knowing tests will catch regressions  
✅ **Living Documentation**: Tests show how code should be used  
✅ **Reduced Technical Debt**: Catch issues before they compound  

## Running Tests in This Project

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-run on file changes)
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

## Project Structure

```
src/
├── utils/
│   ├── __tests__/
│   │   └── calculator.test.ts        # Unit tests for calculator
│   └── calculator.ts                  # Calculator implementation
├── components/
│   ├── __tests__/
│   │   └── Button.test.tsx           # Component tests
│   └── Button.tsx                     # Component implementation
└── setupTests.ts                      # Jest configuration
```

## Examples in This Project

### 1. **Calculator Utils** (`src/utils/calculator.ts`)
A simple example showing TDD with pure functions:

**Test First** → Define expected behavior:
```typescript
it('should add two positive numbers', () => {
  expect(add(2, 3)).toBe(5);
});
```

**Then Implement** → Write code to pass tests:
```typescript
export function add(a: number, b: number): number {
  return a + b;
}
```

### 2. **Button Component** (`src/components/Button.tsx`)
A React component example showing component testing:

**Test First** → Describe component behavior:
```typescript
it('should render button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
```

**Then Implement** → Create component to match tests:
```typescript
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
);
```

## Writing Your Own TDD Tests

### Step 1: Create a test file
```typescript
// src/utils/__tests__/myFeature.test.ts
describe('MyFeature', () => {
  it('should do something specific', () => {
    // Test implementation
  });
});
```

### Step 2: Write failing tests (RED phase)
```typescript
describe('formatCurrency', () => {
  it('should format number as USD currency', () => {
    expect(formatCurrency(99.5)).toBe('$99.50');
  });
});
```

### Step 3: Run tests and see them fail
```bash
npm test
```

### Step 4: Implement minimal code (GREEN phase)
```typescript
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
```

### Step 5: Run tests again - they pass!

### Step 6: Refactor if needed (REFACTOR phase)
```typescript
// Improved version with better error handling
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount');
  }
  return `$${amount.toFixed(2)}`;
}
```

Add test for new behavior, then refactor.

## Best Practices

### ✅ DO:
- **Write one test at a time** - Focus on one behavior per test
- **Use descriptive test names** - `should return true when user is admin` is better than `test1`
- **Test behavior, not implementation** - Test *what* not *how*
- **Keep tests simple** - One assertion per test when possible
- **Use realistic data** - Don't test with "foo" and "bar" if using user objects
- **Mock external dependencies** - API calls, database, etc.

### ❌ DON'T:
- Write all tests then all implementation
- Test multiple things in one test
- Test internal implementation details
- Ignore failing tests
- Write tests that are harder to understand than the code
- Skip refactoring

## Testing Tools Available

This project includes:

- **Jest**: Test runner and assertion library
- **React Testing Library**: For testing React components
- **@testing-library/user-event**: For simulating user interactions

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Kent C. Dodds - Testing Guide](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Next Steps

1. Try writing a test for a new feature first
2. See it fail
3. Implement just enough code to make it pass
4. Refactor and optimize
5. Repeat!

Happy testing! 🚀
