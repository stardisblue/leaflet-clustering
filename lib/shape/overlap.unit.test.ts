// @vitest-environment happy-dom

import { circleMarker, icon, marker } from 'leaflet';
import { describe, expect, it } from 'vitest';

import { CircleLeaf } from './Circle';
import {
  circleCircleOverlap,
  rectCircleOverlap,
  rectRectOverlap,
} from './overlap';
import { RectangleLeaf } from './Rectangle';

function circle(x: number, y: number, radius: number) {
  return new CircleLeaf(x, y, circleMarker([0, 0], { radius }));
}

describe('Circle Circle overlap', () => {
  it.each([
    { a: circle(0, 0, 10), b: circle(14, 0, 5) },
    { a: circle(1, 1, 10), b: circle(0, 14, 5) },
    { a: circle(1, 1, 10), b: circle(7, 7, 5) },
  ])('is >0 if there is overlap between $a & $b', ({ a, b }) => {
    expect(circleCircleOverlap(a, b, 0)).toBeGreaterThan(0);
    expect(circleCircleOverlap(b, a, 0)).toBeGreaterThan(0);
  });

  it.each([
    { a: circle(0, 0, 10), b: circle(15, 0, 5) },
    { a: circle(1, 1, 10), b: circle(0, 16, 5) },
    { a: circle(1, 1, 10), b: circle(12, 12, 5) },
  ])('is <=0 if there is no overlap between $a & $b', ({ a, b }) => {
    expect(circleCircleOverlap(a, b, 0)).toBeLessThanOrEqual(0);
    expect(circleCircleOverlap(b, a, 0)).toBeLessThanOrEqual(0);
  });

  it.each([
    { a: circle(0, 0, 10), b: circle(15, 0, 5) },
    { a: circle(1, 1, 10), b: circle(0, 16, 5) },
    { a: circle(1, 1, 10), b: circle(12, 12, 5) },
  ])('is >0 if there is overlap between $a & $b with padding', ({ a, b }) => {
    expect(circleCircleOverlap(a, b, 2)).toBeGreaterThan(0);
    expect(circleCircleOverlap(b, a, 2)).toBeGreaterThan(0);
  });

  it.each([
    { a: circle(0, 0, 10), b: circle(17, 0, 5) },
    { a: circle(1, 1, 10), b: circle(0, 18, 5) },
    { a: circle(1, 1, 10), b: circle(15, 15, 5) },
  ])(
    'is <=0 if there is no overlap between $a & $b with padding',
    ({ a, b }) => {
      expect(circleCircleOverlap(a, b, 2)).toBeLessThanOrEqual(0);
      expect(circleCircleOverlap(b, a, 2)).toBeLessThanOrEqual(0);
    }
  );
});

function rect(x: number, y: number, h: number, w: number) {
  const iconic = icon({ iconSize: [h, w], iconUrl: '', iconAnchor: [0, 0] });
  return new RectangleLeaf(x, y, marker([0, 0], { icon: iconic }));
}

describe('Rectangle Rectangle Overlap', () => {
  it.each([
    { a: rect(0, 0, 10, 10), b: rect(9, 0, 5, 5) },
    { a: rect(1, 1, 10, 10), b: rect(0, 9, 5, 5) },
    { a: rect(1, 1, 10, 10), b: rect(3, 3, 5, 5) },
  ])('is >0 if there is overlap between $a & $b', ({ a, b }) => {
    expect(rectRectOverlap(a, b, 0)).toBeGreaterThan(0);
    expect(rectRectOverlap(b, a, 0)).toBeGreaterThan(0);
  });

  it.each([
    { a: rect(0, 0, 10, 10), b: rect(15, 0, 5, 5) },
    { a: rect(1, 1, 10, 10), b: rect(0, 16, 5, 5) },
    { a: rect(1, 1, 10, 10), b: rect(12, 12, 5, 5) },
  ])('is <=0 if there is no overlap between $a & $b', ({ a, b }) => {
    expect(rectRectOverlap(a, b, 0)).toBeLessThanOrEqual(0);
    expect(rectRectOverlap(b, a, 0)).toBeLessThanOrEqual(0);
  });

  it.each([
    { a: rect(0, 0, 10, 10), b: rect(11, 0, 5, 5) },
    { a: rect(1, 1, 10, 10), b: rect(0, 11, 5, 5) },
    { a: rect(1, 1, 10, 10), b: rect(6, 6, 5, 5) },
  ])('is > 0 if there is overlap between $a & $b with padding', ({ a, b }) => {
    expect(rectRectOverlap(a, b, 2)).toBeGreaterThan(0);
    expect(rectRectOverlap(b, a, 2)).toBeGreaterThan(0);
  });

  it.each([
    { a: rect(0, 0, 10, 10), b: rect(13, 0, 5, 5) },
    { a: rect(1, 1, 10, 10), b: rect(0, 14, 5, 5) },
    { a: rect(1, 1, 10, 10), b: rect(15, 15, 5, 5) },
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
    { a: rect(0, 0, 10, 10), b: circle(9, 0, 5) },
    { a: rect(1, 1, 10, 10), b: circle(0, 9, 5) },
    { a: rect(1, 1, 10, 10), b: circle(3, 3, 5) },
  ])('is >0 if there is overlap between $a & $b', ({ a, b }) => {
    expect(rectCircleOverlap(a, b, 0)).toBeGreaterThan(0);
  });

  it.each([
    { a: rect(0, 0, 10, 10), b: circle(15, 0, 5) },
    { a: rect(1, 1, 10, 10), b: circle(1, 16, 5) },
    { a: rect(1, 1, 10, 10), b: circle(15, 15, 5) },
  ])('is <=0 if there is no overlap between $a & $b', ({ a, b }) => {
    expect(rectCircleOverlap(a, b, 0)).toBeLessThanOrEqual(0);
  });

  it.each([
    { a: rect(0, 0, 10, 10), b: circle(11, 0, 5) },
    { a: rect(1, 1, 10, 10), b: circle(0, 11, 5) },
    { a: rect(1, 1, 10, 10), b: circle(6, 6, 5) },
  ])('is > 0 if there is overlap between $a & $b with padding', ({ a, b }) => {
    expect(rectCircleOverlap(a, b, 2)).toBeGreaterThan(0);
  });

  it.each([
    { a: rect(0, 0, 10, 10), b: circle(17, 0, 5) },
    { a: rect(1, 1, 10, 10), b: circle(1, 18, 5) },
    { a: rect(1, 1, 10, 10), b: circle(16, 16, 5) },
  ])(
    'is <=0 if there is no overlap between $a & $b with padding',
    ({ a, b }) => {
      expect(rectCircleOverlap(a, b, 2)).toBeLessThanOrEqual(0);
    }
  );
});
