import { LatLng, Point } from 'leaflet';
import { BBox } from 'rbush';
import { CircleClusterMarker, SupportedMarker } from '../CircleClusterMarker';
import { Leaf, Pair } from '../binary-tree-traversal';

export interface Clustering {
  clusterize(
    items: SupportedMarker[],
    project: (latlng: LatLng) => Point,
    unproject: (point: { x: number; y: number }) => LatLng
  ): (CircleClusterMarker | SupportedMarker)[];
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
