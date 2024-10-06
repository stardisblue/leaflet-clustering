import { Leaf, Pair } from '@/binary-tree-traversal';
import { BBox } from 'rbush';

export interface Shape {
  readonly x: number;
  readonly y: number;
  readonly minX: number;
  readonly minY: number;

  toPaddedBBox(padding: number): BBox;
  overlaps<T extends Shape = Shape>(other: T, padding: number): number;
}

export interface ShapedLeaf<T = any> extends Shape, Leaf<T> {
  data: T;
}

export interface ShapedCluster extends Shape, Pair {
  readonly left: ShapedCluster | ShapedLeaf;
  readonly right: ShapedCluster | ShapedLeaf;
}
