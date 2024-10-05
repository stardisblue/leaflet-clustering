import { CircleMarker } from 'leaflet';
import { BBox } from 'rbush';

import { SpatialCluster, SpatialLeaf, SpatialObject } from './model';
import { circleCircleOverlap } from './overlap';

export abstract class Circle implements SpatialObject {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly radius: number,
    private readonly padding: number
  ) {}
  toPaddedBBox(): BBox {
    return {
      minX: this.minX - this.padding,
      minY: this.minY - this.padding,
      maxX: this.x + this.radius + this.padding,
      maxY: this.y + this.radius + this.padding,
    };
  }
  get minX(): number {
    return this.x - this.radius;
  }
  get minY(): number {
    return this.y - this.radius;
  }
  overlaps<T extends SpatialObject = SpatialObject>(other: T): number {
    if (other instanceof Circle) {
      return circleCircleOverlap(this, other, this.padding);
    }

    return other.overlaps(this);
  }
}

export type CircleClusterOptions = {
  padding: number;
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
      padding,
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

    super(x, y, r, padding);
    this.w = w;
  }
}

export class CircleLeaf extends Circle implements SpatialLeaf<CircleMarker> {
  constructor(
    x: number,
    y: number,
    padding: number,
    readonly data: CircleMarker
  ) {
    super(x, y, data.getRadius(), padding);
  }
}
