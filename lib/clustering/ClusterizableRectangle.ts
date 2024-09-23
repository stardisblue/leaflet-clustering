import { Marker } from 'leaflet';
import { BBox } from 'rbush';
import { ClusterizableCircle } from './ClusterizableCircle';
import { Clusterizable, ClusterizableLeaf } from './model';
import { rectCircleOverlap, rectRectOverlap } from './overlap';

export class ClusterizableRectangleLeaf implements ClusterizableLeaf<Marker> {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;

  constructor(
    readonly x: number,
    readonly y: number,
    private readonly padding: number,
    readonly data: Marker
  ) {
    const icon = data.getIcon();

    if (
      icon.options.iconSize === undefined ||
      icon.options.iconAnchor === undefined
    ) {
      throw new Error('iconSize or iconAnchor is not defined');
    }

    const [xAnchor, yAnchor] = icon.options.iconAnchor as number[];
    const [width, height] = icon.options.iconSize as number[];

    this.minX = x - xAnchor;
    this.minY = y - yAnchor;
    this.maxX = this.minX + width;
    this.maxY = this.minY + height;
  }

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
