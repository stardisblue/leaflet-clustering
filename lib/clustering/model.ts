import { BBox } from 'rbush';
import { SupportedMarker } from '../CircleClusterMarker';
import { Leaf, Pair } from '../binary-tree-traversal';
import { LatLng, Point } from 'leaflet';

export type ClusteringCtor<C extends Clustering<any>, O> = new (
  options: O
) => C;

export type ClusteringOptions = {
  project: (layer: LatLng) => Point;
  unproject: (point: { x: number; y: number }) => LatLng;
};

export interface Clustering<M extends SupportedMarker> {
  clusterize(items: SupportedMarker[], options: ClusteringOptions): M[];
}

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
