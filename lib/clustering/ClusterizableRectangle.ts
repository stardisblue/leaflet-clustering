import { Marker } from 'leaflet';
import { BBox } from 'rbush';
import { ClusterizableCircle } from './ClusterizableCircle';
import { Clusterizable, ClusterizableLeaf, ClusterizablePair } from './model';
import { rectCircleOverlap, rectRectOverlap } from './overlap';

export abstract class ClusterizableRectangle implements Clusterizable {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly minX: number,
    readonly minY: number,
    readonly maxX: number,
    readonly maxY: number,
    private readonly padding: number
  ) {}
  toPaddedBBox(): BBox {
    return {
      minX: this.minX - this.padding,
      minY: this.minY - this.padding,
      maxX: this.maxX + this.padding,
      maxY: this.maxY + this.padding,
    };
  }
  overlaps<T extends Clusterizable = Clusterizable>(other: T): number {
    if (other instanceof ClusterizableRectangle) {
      return rectRectOverlap(this, other);
    } else if (other instanceof ClusterizableCircle) {
      return rectCircleOverlap(this, other);
    }

    return other.overlaps(this);
  }
}

export type ClusterizableSquareClusterOptions = {
  padding: number;
  scale?: (weight: number) => number;
  weight?: <T>(leaf: ClusterizablePair | ClusterizableLeaf<T>) => number;
  baseWidth?: number;
};

export class ClusterizableSquareCluster
  extends ClusterizableRectangle
  implements ClusterizablePair
{
  readonly w: number;

  constructor(
    readonly left: ClusterizableSquareCluster | ClusterizableLeaf,
    readonly right: ClusterizableSquareCluster | ClusterizableLeaf,
    {
      padding,
      scale = Math.sqrt,
      weight = () => 1,
      baseWidth = 10,
    }: ClusterizableSquareClusterOptions
  ) {
    const leftW =
      left instanceof ClusterizableSquareCluster ? left.w : weight(left);
    const rightW =
      right instanceof ClusterizableSquareCluster ? right.w : weight(right);

    const w = leftW + rightW;
    const x = (left.x * leftW + right.x * rightW) / w;
    const y = (left.y * leftW + right.y * rightW) / w;

    const r = scale(w) + baseWidth;

    super(x, y, x - r, y - r, x + r, y + r, padding);
    this.w = w;
  }
}

export class ClusterizableRectangleLeaf
  extends ClusterizableRectangle
  implements ClusterizableLeaf<Marker>
{
  constructor(
    x: number,
    y: number,
    padding: number,
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

    const minX = x - xAnchor;
    const minY = y - yAnchor;
    const maxX = minX + width;
    const maxY = minY + height;

    super(x, y, minX, minY, maxX, maxY, padding);
  }
}
