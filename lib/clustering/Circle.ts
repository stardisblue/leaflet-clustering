import { CircleMarker } from 'leaflet';
import { BBox } from 'rbush';

import { SpatialCluster, SpatialLeaf, SpatialObject } from './model';
import { circleCircleOverlap } from './overlap';

export abstract class Circle implements SpatialObject {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly radius: number
  ) {}
  toPaddedBBox(padding: number): BBox {
    return {
      minX: this.minX - padding,
      minY: this.minY - padding,
      maxX: this.x + this.radius + padding,
      maxY: this.y + this.radius + padding,
    };
  }
  get minX(): number {
    return this.x - this.radius;
  }
  get minY(): number {
    return this.y - this.radius;
  }
  overlaps<T extends SpatialObject = SpatialObject>(
    other: T,
    padding: number
  ): number {
    if (other instanceof Circle) {
      return circleCircleOverlap(this, other, padding);
    }

    return other.overlaps(this, padding);
  }
}

export type CircleClusterOptions = {
  scale?: (weight: number) => number;
  weight?: <T>(leaf: SpatialCluster | SpatialLeaf<T>) => number;
  baseRadius?: number;
};

export class CircleCluster extends Circle implements SpatialCluster {
  readonly w: number;

  constructor(
    readonly left: CircleCluster | SpatialLeaf,
    readonly right: CircleCluster | SpatialLeaf,
    {
      scale = Math.sqrt,
      weight = () => 1,
      baseRadius = 10,
    }: CircleClusterOptions
  ) {
    const leftW = left instanceof CircleCluster ? left.w : weight(left);
    const rightW = right instanceof CircleCluster ? right.w : weight(right);

    const w = leftW + rightW;
    const x = (left.x * leftW + right.x * rightW) / w;
    const y = (left.y * leftW + right.y * rightW) / w;
    const r = scale(w) + baseRadius;

    super(x, y, r);
    this.w = w;
  }
}

export class CircleLeaf extends Circle implements SpatialLeaf<CircleMarker> {
  constructor(
    x: number,
    y: number,
    readonly data: CircleMarker
  ) {
    super(x, y, data.getRadius());
  }
}
