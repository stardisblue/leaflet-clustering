import { clamp } from './clamp';
import { ClusterizableCircle } from './ClusterizableCircle';
import { ClusterizableRectangle } from './ClusterizableRectangle';

/**
 * Returns positive number of a and b overlap
 *
 * The value corresponds to the area of the overlapping rectangle. Does not take in account rotations
 */
export function rectRectOverlap(
  a: ClusterizableRectangle,
  b: ClusterizableRectangle
) {
  const padded = b.toPaddedBBox();
  const overlapX =
    Math.min(a.maxX, padded.maxX) - Math.max(a.minX, padded.minX);
  const overlapY =
    Math.min(a.maxY, padded.maxY) - Math.max(a.minY, padded.minY);

  if (overlapX < 0 && overlapY < 0) {
    return -(overlapX * overlapY);
  }

  return overlapY * overlapX;
}

/**
 * Returns positive number of a and b overlap
 *
 * The value corresponds to the overlapping distance squared
 */
export function circleCircleOverlap(
  a: ClusterizableCircle,
  b: ClusterizableCircle,
  padding: number
): number {
  return (
    (a.radius + b.radius + padding) ** 2 - ((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
  );
}

/**
 * Returns positive number of a and b overlap
 *
 * The value corresponds to the overlapping distance squared
 */
export function rectCircleOverlap(
  a: ClusterizableRectangle,
  b: ClusterizableCircle
) {
  const bbox = a.toPaddedBBox();
  const closestX = clamp(b.x, bbox.minX, bbox.maxX);
  const closestY = clamp(b.y, bbox.minY, bbox.maxY);

  return b.radius ** 2 - ((b.x - closestX) ** 2 + (b.y - closestY) ** 2);
}
