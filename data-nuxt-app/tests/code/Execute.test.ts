import { describe, test, expect, vi } from 'vitest';
import { createSandbox, executeFormula } from '../../services/FormulaService';

describe('createSandbox', () => {
  // Test 1: Creates sandbox with expected functionality
  test('creates a sandbox with map and ANPR utilities', () => {
    const mockAnprData = [{ roadId: 'r1', avgSpeed: 60 }];
    const mockMapData = [{ roadId: 'r1', vehicleDensity: 10 }];

    const sandbox = createSandbox(mockAnprData, mockMapData);

    // expect(sandbox.map.getSpeed('r1')).toEqual([60]);
    expect(sandbox.map.getDensity('r1')).toEqual([10]);
    expect(sandbox.avg([1, 2, 3])).toBe(2);
    expect(sandbox.sum([1, 2, 3])).toBe(6);
    expect(sandbox.count([1, 2, 3])).toBe(3);
  });

  // Test 2: Handles missing data gracefully
  test('handles missing data in sandbox', () => {
    const sandbox = createSandbox([], []);

    expect(sandbox.map.getSpeed('r1')).toEqual([]);
    expect(sandbox.map.getDensity('r1')).toEqual([]);
    expect(sandbox.avg([])).toBe(0);
    expect(sandbox.sum([])).toBe(0);
    expect(sandbox.count([])).toBe(0);
  });
});


describe('executeFormula', () => {
    // Test 1: Successfully evaluates a valid formula
    test('evaluates a valid formula', async () => {
      const sandbox = {
        avg: (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length,
      };
  
      const result = await executeFormula('avg([1, 2, 3])', sandbox);
  
      expect(result).toBe(2);
    });
  

  });