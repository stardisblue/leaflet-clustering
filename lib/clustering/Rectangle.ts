import { Marker } from 'leaflet';
import { BBox } from 'rbush';

import { Circle } from './Circle';
import { SpatialCluster, SpatialLeaf, SpatialObject } from './model';
import { rectCircleOverlap, rectRectOverlap } from './overlap';

export abstract class Rectangle implements SpatialObject {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly minX: number,
    readonly minY: number,
    readonly maxX: number,
    readonly maxY: number
  ) {}
  toPaddedBBox(padding: number): BBox {
    return {
      minX: this.minX - padding,
      minY: this.minY - padding,
      maxX: this.maxX + padding,
      maxY: this.maxY + padding,
    };
  }
  overlaps<T extends SpatialObject = SpatialObject>(
    other: T,
    padding: number
  ): number {
    if (other instanceof Rectangle) {
      return rectRectOverlap(this, other, padding);
    } else if (other instanceof Circle) {
      return rectCircleOverlap(this, other, padding);
    }

    return other.overlaps(this, padding);
  }
}

export type SquareClusterOptions = {
  scale?: (weight: number) => number;
  weight?: <T>(leaf: SpatialCluster | SpatialLeaf<T>) => number;
  baseWidth?: number;
};

export class SquareCluster extends Rectangle implements SpatialCluster {
  readonly w: number;

  constructor(
    readonly left: SquareCluster | SpatialLeaf,
    readonly right: SquareCluster | SpatialLeaf,
    {
      scale = Math.sqrt,
      weight = () => 1,
      baseWidth = 10,
    }: SquareClusterOptions
  ) {
    const leftW = left instanceof SquareCluster ? left.w : weight(left);
    const rightW = right instanceof SquareCluster ? right.w : weight(right);

    const w = leftW + rightW;
    const x = (left.x * leftW + right.x * rightW) / w;
    const y = (left.y * leftW + right.y * rightW) / w;

    const r = scale(w) + baseWidth;

    super(x, y, x - r, y - r, x + r, y + r);
    this.w = w;
  }
}

export class RectangleLeaf extends Rectangle implements SpatialLeaf<Marker> {
  constructor(
    x: number,
    y: number,
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

    super(x, y, minX, minY, maxX, maxY);
  }
}
