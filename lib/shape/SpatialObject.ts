import { Leaf, Pair } from '@/binary-tree-traversal';
import { BBox } from 'rbush';

export interface SpatialObject {
  readonly x: number;
  readonly y: number;
  readonly minX: number;
  readonly minY: number;

  toPaddedBBox(padding: number): BBox;
  overlaps<T extends SpatialObject = SpatialObject>(
    other: T,
    padding: number
  ): number;
}

export interface SpatialLeaf<T = any> extends SpatialObject, Leaf<T> {
  data: T;
}

export interface SpatialCluster extends SpatialObject, Pair {
  readonly left: SpatialCluster | SpatialLeaf;
  readonly right: SpatialCluster | SpatialLeaf;
}
