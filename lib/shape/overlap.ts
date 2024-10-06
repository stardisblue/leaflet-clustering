import { Circle } from './Circle';
import { clamp } from './clamp';
import { Rectangle } from './Rectangle';

/**
 * Returns positive number of a and b overlap
 *
 * The value corresponds to the area of the overlapping rectangle. Does not take in account rotations
 */
export function rectRectOverlap(a: Rectangle, b: Rectangle, padding: number) {
  const overlapX =
    Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX) + padding;
  const overlapY =
    Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY) + padding;

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
  a: Circle,
  b: Circle,
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
export function rectCircleOverlap(a: Rectangle, b: Circle, padding: number) {
  const closestX = clamp(b.x, a.minX, a.maxX);
  const closestY = clamp(b.y, a.minY, a.maxY);

  return (
    (b.radius + padding) ** 2 - ((b.x - closestX) ** 2 + (b.y - closestY) ** 2)
  );
}
