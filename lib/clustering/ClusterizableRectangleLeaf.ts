import { Marker } from 'leaflet';
import { BBox } from 'rbush';
import { ClusterizableCircle } from './ClusterizableCircle';
import { Clusterizable, ClusterizableLeaf } from './model';
import { rectCircleOverlap, rectRectOverlap } from './overlap';

export class ClusterizableRectangleLeaf implements ClusterizableLeaf<Marker> {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly minX: number,
    readonly minY: number,
    readonly maxX: number,
    readonly maxY: number,
    readonly w: number,
    private readonly padding: number,
    readonly data: Marker
  ) {}
  toPaddedBBox(): BBox {
    return {
      minX: this.minX - this.padding,
      minY: this.minY - this.padding,
      maxX: this.maxX + this.padding,
      maxY: this.maxY + this.padding,
    };
  }

  overlaps(other: Clusterizable): number {
    if (other instanceof ClusterizableRectangleLeaf) {
      return rectRectOverlap(this, other);
    } else if (other instanceof ClusterizableCircle) {
      return rectCircleOverlap(this, other);
    }

    return other.overlaps(this);
  }
}
