/**
 * Example Test-Driven Development (TDD) Test Suite
 * 
 * This demonstrates the TDD workflow:
 * 1. RED: Write tests first (they will fail)
 * 2. GREEN: Write minimal code to pass tests
 * 3. REFACTOR: Improve code while keeping tests passing
 */

import { add, subtract, multiply, divide } from '../calculator';

describe('Calculator Utils - TDD Example', () => {
  describe('add function', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-1, -1)).toBe(-2);
    });

    it('should add zero', () => {
      expect(add(0, 5)).toBe(5);
    });

    it('should handle decimal numbers', () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });

  describe('subtract function', () => {
    it('should subtract two positive numbers', () => {
      expect(subtract(10, 3)).toBe(7);
    });

    it('should handle negative results', () => {
      expect(subtract(3, 10)).toBe(-7);
    });
  });

  describe('multiply function', () => {
    it('should multiply two numbers', () => {
      expect(multiply(4, 5)).toBe(20);
    });

    it('should multiply by zero', () => {
      expect(multiply(100, 0)).toBe(0);
    });

    it('should handle negative multiplication', () => {
      expect(multiply(-3, 4)).toBe(-12);
    });
  });

  describe('divide function', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });

    it('should handle decimal results', () => {
      expect(divide(7, 2)).toBe(3.5);
    });
  });
});
