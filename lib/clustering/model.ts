import { BBox } from 'rbush';
import { SupportedMarker } from '../CircleClusterMarker';
import { Leaf, Pair } from '../binary-tree-traversal';
import { CircleMarker, Marker } from 'leaflet';

export interface Clustering<C, M extends CircleMarker | Marker> {
  clusterize(items: SupportedMarker[], options: C): (M | SupportedMarker)[];
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
