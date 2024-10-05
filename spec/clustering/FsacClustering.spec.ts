import { icon, marker } from 'leaflet';
import { describe, expect, test } from 'vitest';

import { RectangleLeaf } from '@/clustering/Rectangle';

const rect = ({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) =>
  new RectangleLeaf(
    x,
    y,
    0,
    marker([0, 0], {
      icon: icon({
        iconAnchor: [0, 0],
        iconUrl: '',
        iconSize: [width, height],
      }),
    })
  );

describe('Rectangle Rectangle Overlap', () => {
  test.each([
    [
      rect({ x: 0, y: 0, width: 10, height: 10 }),
      rect({ x: 5, y: 5, width: 10, height: 10 }),
      25,
    ],
    [
      rect({ x: 0, y: 0, width: 10, height: 10 }),
      rect({ x: 15, y: 15, width: 10, height: 10 }),
      -25,
    ],
    [
      rect({ x: 0, y: 0, width: 10, height: 10 }),
      rect({ x: 5, y: 15, width: 10, height: 10 }),
      -25,
    ],
    [
      rect({ x: 0, y: 0, width: 10, height: 10 }),
      rect({ x: 15, y: 5, width: 10, height: 10 }),
      -25,
    ],
  ])(
    'rectRectOverlap(%s, %s) -> %i',
    (a: RectangleLeaf, b: RectangleLeaf, expected) => {
      expect(a.overlaps(b)).toBe(expected);
      expect(b.overlaps(a)).toBe(expected);
    }
  );
});
