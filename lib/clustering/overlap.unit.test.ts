// @vitest-environment happy-dom

import { circleMarker } from 'leaflet';
import { describe, expect, it } from 'vitest';

import { circleCircleOverlap } from './overlap';
import { CircleLeaf } from './Circle';

function c(x: number, y: number, radius: number) {
  return new CircleLeaf(x, y, circleMarker([0, 0], { radius }));
}

describe('Circle Circle overlap', () => {
  it.each([
    { a: c(0, 0, 10), b: c(14, 0, 5) },
    { a: c(1, 1, 10), b: c(0, 14, 5) },
    { a: c(1, 1, 10), b: c(7, 7, 5) },
  ])('is >0 if there is overlap between $a & $b', ({ a, b }) => {
    expect(circleCircleOverlap(a, b, 0)).toBeGreaterThan(0);
    expect(circleCircleOverlap(b, a, 0)).toBeGreaterThan(0);
  });

  it.each([
    { a: c(0, 0, 10), b: c(15, 0, 5) },
    { a: c(1, 1, 10), b: c(0, 16, 5) },
    { a: c(1, 1, 10), b: c(12, 12, 5) },
  ])('is <=0 if there is no overlap between $a & $b', ({ a, b }) => {
    expect(circleCircleOverlap(a, b, 0)).toBeLessThanOrEqual(0);
    expect(circleCircleOverlap(b, a, 0)).toBeLessThanOrEqual(0);
  });

  it.each([
    { a: c(0, 0, 10), b: c(15, 0, 5) },
    { a: c(1, 1, 10), b: c(0, 16, 5) },
    { a: c(1, 1, 10), b: c(12, 12, 5) },
  ])('is >0 if there is overlap between $a & $b with padding', ({ a, b }) => {
    expect(circleCircleOverlap(a, b, 2)).toBeGreaterThan(0);
    expect(circleCircleOverlap(b, a, 2)).toBeGreaterThan(0);
  });

  it.each([
    { a: c(0, 0, 10), b: c(17, 0, 5) },
    { a: c(1, 1, 10), b: c(0, 18, 5) },
    { a: c(1, 1, 10), b: c(15, 15, 5) },
  ])(
    'is <=0 if there is no overlap between $a & $b with padding',
    ({ a, b }) => {
      expect(circleCircleOverlap(a, b, 2)).toBeLessThanOrEqual(0);
      expect(circleCircleOverlap(b, a, 2)).toBeLessThanOrEqual(0);
    }
  );
});
