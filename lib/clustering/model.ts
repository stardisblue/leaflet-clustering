import { LatLng, Point } from 'leaflet';
import { BBox } from 'rbush';
import { SupportedMarker } from '../CircleClusterMarker';
import { Leaf, Pair } from '../binary-tree-traversal';
import { Options } from '../options';

export type ClusterizeOptions = {
  project: (layer: LatLng) => Point;
  unproject: (point: { x: number; y: number }) => LatLng;
};

export interface ClusteringMethod<M extends SupportedMarker> {
  readonly inhibitors?: (keyof Options)[];
  clusterize(items: SupportedMarker[], options: ClusterizeOptions): M[];
}

export type ClusteringMethodCtor<
  C extends ClusteringMethod<any>,
  O = any,
> = new (options: O) => C;

export type ClusteringMethodOptions<C> = C extends new (options: infer O) => any
  ? O
  : never;

export interface Clusterizable {
  readonly x: number;
  readonly y: number;
  readonly minX: number;
  readonly minY: number;
  toPaddedBBox(): BBox;
  overlaps<T extends Clusterizable = Clusterizable>(other: T): number;
}

export interface ClusterizableLeaf<T = any> extends Clusterizable, Leaf<T> {
  data: T;
}

export interface ClusterizablePair extends Clusterizable, Pair {
  readonly left: ClusterizablePair | ClusterizableLeaf;
  readonly right: ClusterizablePair | ClusterizableLeaf;
}
