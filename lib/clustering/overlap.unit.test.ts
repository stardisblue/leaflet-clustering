// @vitest-environment happy-dom

import { circleMarker, divIcon, marker } from 'leaflet';
import { describe, expect, it } from 'vitest';

import {
  circleCircleOverlap,
  rectCircleOverlap,
  rectRectOverlap,
} from './overlap';
import { RectangleLeaf } from './Rectangle';
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

function r(x: number, y: number, h: number, w: number) {
  const icon = divIcon({ iconSize: [h, w], iconAnchor: [0, 0] });
  return new RectangleLeaf(x, y, marker([0, 0], { icon }));
}

describe('Rectangle Rectangle Overlap', () => {
  it.each([
    { a: r(0, 0, 10, 10), b: r(9, 0, 5, 5) },
    { a: r(1, 1, 10, 10), b: r(0, 9, 5, 5) },
    { a: r(1, 1, 10, 10), b: r(3, 3, 5, 5) },
  ])('is >0 if there is overlap between $a & $b', ({ a, b }) => {
    expect(rectRectOverlap(a, b, 0)).toBeGreaterThan(0);
    expect(rectRectOverlap(b, a, 0)).toBeGreaterThan(0);
  });

  it.each([
    { a: r(0, 0, 10, 10), b: r(15, 0, 5, 5) },
    { a: r(1, 1, 10, 10), b: r(0, 16, 5, 5) },
    { a: r(1, 1, 10, 10), b: r(12, 12, 5, 5) },
  ])('is <=0 if there is no overlap between $a & $b', ({ a, b }) => {
    expect(rectRectOverlap(a, b, 0)).toBeLessThanOrEqual(0);
    expect(rectRectOverlap(b, a, 0)).toBeLessThanOrEqual(0);
  });

  it.each([
    { a: r(0, 0, 10, 10), b: r(11, 0, 5, 5) },
    { a: r(1, 1, 10, 10), b: r(0, 11, 5, 5) },
    { a: r(1, 1, 10, 10), b: r(6, 6, 5, 5) },
  ])('is > 0 if there is overlap between $a & $b with padding', ({ a, b }) => {
    expect(rectRectOverlap(a, b, 2)).toBeGreaterThan(0);
    expect(rectRectOverlap(b, a, 2)).toBeGreaterThan(0);
  });

  it.each([
    { a: r(0, 0, 10, 10), b: r(13, 0, 5, 5) },
    { a: r(1, 1, 10, 10), b: r(0, 14, 5, 5) },
    { a: r(1, 1, 10, 10), b: r(15, 15, 5, 5) },
  ])(
    'is <=0 if there is no overlap between $a & $b with padding',
    ({ a, b }) => {
      expect(rectRectOverlap(a, b, 2)).toBeLessThanOrEqual(0);
      expect(rectRectOverlap(b, a, 2)).toBeLessThanOrEqual(0);
    }
  );
});

describe('Rectangle Circle Overlap', () => {
  it.each([
    { a: r(0, 0, 10, 10), b: c(9, 0, 5) },
    { a: r(1, 1, 10, 10), b: c(0, 9, 5) },
    { a: r(1, 1, 10, 10), b: c(3, 3, 5) },
  ])('is >0 if there is overlap between $a & $b', ({ a, b }) => {
    expect(rectCircleOverlap(a, b, 0)).toBeGreaterThan(0);
  });

  it.each([
    { a: r(0, 0, 10, 10), b: c(15, 0, 5) },
    { a: r(1, 1, 10, 10), b: c(1, 16, 5) },
    { a: r(1, 1, 10, 10), b: c(15, 15, 5) },
  ])('is <=0 if there is no overlap between $a & $b', ({ a, b }) => {
    expect(rectCircleOverlap(a, b, 0)).toBeLessThanOrEqual(0);
  });

  it.each([
    { a: r(0, 0, 10, 10), b: c(11, 0, 5) },
    { a: r(1, 1, 10, 10), b: c(0, 11, 5) },
    { a: r(1, 1, 10, 10), b: c(6, 6, 5) },
  ])('is > 0 if there is overlap between $a & $b with padding', ({ a, b }) => {
    expect(rectCircleOverlap(a, b, 2)).toBeGreaterThan(0);
  });

  it.each([
    { a: r(0, 0, 10, 10), b: c(17, 0, 5) },
    { a: r(1, 1, 10, 10), b: c(1, 18, 5) },
    { a: r(1, 1, 10, 10), b: c(16, 16, 5) },
  ])(
    'is <=0 if there is no overlap between $a & $b with padding',
    ({ a, b }) => {
      expect(rectCircleOverlap(a, b, 2)).toBeLessThanOrEqual(0);
    }
  );
});
