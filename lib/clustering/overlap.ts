import { CircleMarker, Marker } from 'leaflet';
import { BBox } from 'rbush';
import { Leaf, Pair } from '../binary-tree-traversal';

function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
}

export interface Clusterizable {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly minX: number;
  readonly minY: number;
  toPaddedBBox(): BBox;
  overlaps(other: this): number;
}

export class RectangleLeaf implements Clusterizable, Leaf<Marker> {
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

  overlaps(other: CircleCls | RectangleLeaf): number {
    if (other instanceof RectangleLeaf) {
      const b = other.toPaddedBBox();
      const overlapX =
        Math.min(this.maxX, b.maxX) - Math.max(this.minX, b.minX);
      const overlapY =
        Math.min(this.maxY, b.maxY) - Math.max(this.minY, b.minY);

      if (overlapX < 0 && overlapY < 0) {
        return -(overlapX * overlapY);
      }

      // rectRectOverlap corresponds to the area of the rectangle
      return overlapY * overlapX;
    } else if (other instanceof CircleCls) {
      return other.overlaps(this);
    }
    throw new Error('Method not implemented.');
  }
}

export abstract class CircleCls implements Clusterizable {
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
  overlaps(other: CircleCls | RectangleLeaf): number {
    if (other instanceof CircleCls) {
      return (
        (this.r + other.r + this.padding) ** 2 -
        ((this.x - other.x) ** 2 + (this.y - other.y) ** 2)
      );
    } else if (other instanceof RectangleLeaf) {
      const bbox = other.toPaddedBBox();
      const closestX = clamp(this.x, bbox.minX, bbox.maxX);
      const closestY = clamp(this.y, bbox.minY, bbox.maxY);

      return (
        this.r ** 2 - ((this.x - closestX) ** 2 + (this.y - closestY) ** 2)
      );
    }
    throw new Error('Not Implemented');
  }
}

export class CircleLeaf extends CircleCls implements Leaf<CircleMarker> {
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

export class CircleCluster extends CircleCls implements Pair {
  constructor(
    x: number,
    y: number,
    r: number,
    w: number,
    padding: number,
    readonly left: CircleCluster | CircleLeaf | RectangleLeaf,
    readonly right: CircleCluster | CircleLeaf | RectangleLeaf
  ) {
    super(x, y, r, w, padding);
  }
}
