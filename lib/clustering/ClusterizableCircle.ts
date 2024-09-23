import { BBox } from 'rbush';
import { circleCircleOverlap } from './overlap';
import { CircleMarker } from 'leaflet';
import { Clusterizable, ClusterizableLeaf, ClusterizablePair } from './model';

export abstract class ClusterizableCircle implements Clusterizable {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly r: number,
    readonly w: number,
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

export class ClusterizableCircleCluster
  extends ClusterizableCircle
  implements ClusterizablePair
{
  constructor(
    readonly left: ClusterizablePair | ClusterizableLeaf,
    readonly right: ClusterizablePair | ClusterizableLeaf,
    padding: number,
    scale: (weight: number) => number,
    baseSize: number
  ) {
    const w = left.w + right.w;
    const x = (left.x * left.w + right.x * right.w) / w;
    const y = (left.y * left.w + right.y * right.w) / w;
    const r = scale(w) + baseSize;

    super(x, y, r, w, padding);
  }
}

export class ClusterizableCircleLeaf
  extends ClusterizableCircle
  implements ClusterizableLeaf<CircleMarker>
{
  constructor(
    x: number,
    y: number,
    r: number,
    w: number,
    padding: number,
    readonly data: CircleMarker
  ) {
    super(x, y, r, w, padding);
  }
}
