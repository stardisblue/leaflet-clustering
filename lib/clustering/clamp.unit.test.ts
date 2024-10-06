import { describe, it, expect } from 'vitest';
import { clamp } from './clamp';

describe('Restricts value between given min and max', () => {
  it("does'nt do anything if value is already between min, max", () => {
    expect(clamp(10, 0, 100)).toBe(10);
  });

  it('clamps to min if value is below', () => {
    expect(clamp(10, 20, 100)).toBe(20);
  });

  it('clamps to max if value is above', () => {
    expect(clamp(120, 20, 100)).toBe(100);
  });
});
