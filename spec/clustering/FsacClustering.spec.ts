import { describe, expect, test } from 'vitest';
import { ClusterizableRectangleLeaf } from '../../lib/clustering/ClusterizableRectangle';
import { marker } from 'leaflet';
import { BBox } from 'rbush';

const bbox = ({ minX, minY, maxX, maxY }: BBox) =>
  new ClusterizableRectangleLeaf(
    0,
    0,
    minX,
    minY,
    maxX,
    maxY,
    0,
    0,
    marker([0, 0])
  );

describe('Rectangle Rectangle Overlap', () => {
  test.each([
    [
      bbox({ minX: 0, minY: 0, maxX: 10, maxY: 10 }),
      bbox({ minX: 5, minY: 5, maxX: 15, maxY: 15 }),
      25,
    ],
    [
      bbox({ minX: 0, minY: 0, maxX: 10, maxY: 10 }),
      bbox({ minX: 15, minY: 15, maxX: 25, maxY: 25 }),
      -25,
    ],
    [
      bbox({ minX: 0, minY: 0, maxX: 10, maxY: 10 }),
      bbox({ minX: 5, minY: 15, maxX: 15, maxY: 25 }),
      -25,
    ],
    [
      bbox({ minX: 0, minY: 0, maxX: 10, maxY: 10 }),
      bbox({ minX: 15, minY: 5, maxX: 25, maxY: 15 }),
      -25,
    ],
  ])(
    'rectRectOverlap(%s, %s) -> %i',
    (
      a: ClusterizableRectangleLeaf,
      b: ClusterizableRectangleLeaf,
      expected
    ) => {
      expect(a.overlaps(b)).toBe(expected);
      expect(b.overlaps(a)).toBe(expected);
    }
  );
});
