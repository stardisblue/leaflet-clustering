import { CircleMarker } from 'leaflet';
import { BBox } from 'rbush';
import { Clusterizable, ClusterizableLeaf, ClusterizablePair } from './model';
import { circleCircleOverlap } from './overlap';
import { scaleSqrt } from 'd3';

export abstract class ClusterizableCircle implements Clusterizable {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly r: number,
    private readonly padding: number
  ) {}
  toPaddedBBox(): BBox {
    return {
      minX: this.minX - this.padding,
      minY: this.minY - this.padding,
      maxX: this.x + this.r + this.padding,
      maxY: this.y + this.r + this.padding,
    };
  }
  get minX(): number {
    return this.x - this.r;
  }
  get minY(): number {
    return this.y - this.r;
  }
  overlaps<T extends Clusterizable = Clusterizable>(other: T): number {
    if (other instanceof ClusterizableCircle) {
      return circleCircleOverlap(this, other, this.padding);
    }

    return other.overlaps(this);
  }
}

export type ClusterizableCircleClusterOptions = {
  padding: number;
  scale?: (weight: number) => number;
  weight?: <T>(leaf: ClusterizablePair | ClusterizableLeaf<T>) => number;
  baseRadius?: number;
};

export class ClusterizableCircleCluster
  extends ClusterizableCircle
  implements ClusterizablePair
{
  readonly w: number;

  constructor(
    readonly left: ClusterizableCircleCluster | ClusterizableLeaf,
    readonly right: ClusterizableCircleCluster | ClusterizableLeaf,
    {
      padding = 4,
      scale = scaleSqrt(),
      weight = () => 1,
      baseRadius = 10,
    }: ClusterizableCircleClusterOptions
  ) {
    const leftW =
      left instanceof ClusterizableCircleCluster ? left.w : weight(left);
    const rightW =
      right instanceof ClusterizableCircleCluster ? right.w : weight(right);

    const w = leftW + rightW;
    const x = (left.x * leftW + right.x * rightW) / w;
    const y = (left.y * leftW + right.y * rightW) / w;
    const r = scale(w) + baseRadius;

    super(x, y, r, padding);
    this.w = w;
  }
}

export class ClusterizableCircleLeaf
  extends ClusterizableCircle
  implements ClusterizableLeaf<CircleMarker>
{
  constructor(
    x: number,
    y: number,
    padding: number,
    readonly data: CircleMarker
  ) {
    super(x, y, data.getRadius(), padding);
  }
}
