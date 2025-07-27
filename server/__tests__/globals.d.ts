// Jest global types for TypeScript
import '@types/jest';

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchObject(expected: Record<string, any>): R;
    }
  }
}