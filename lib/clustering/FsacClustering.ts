import { CircleMarker, LatLng, Marker, Point } from 'leaflet';
import { flatten } from '../binary-tree-traversal';
import { CircleClusterMarker, SupportedMarker } from '../CircleClusterMarker';
import { Fsac } from '../fsac';
import {
  ClusterizableCircleCluster,
  ClusterizableCircleClusterOptions,
  ClusterizableCircleLeaf,
} from './ClusterizableCircle';
import { ClusterizableRectangleLeaf } from './ClusterizableRectangle';
import type { Clustering, ClusterizableLeaf, ClusterizablePair } from './model';

export type FsacClusteringOptions<
  O,
  P extends ClusterizablePair,
  M extends CircleMarker | Marker = CircleClusterMarker,
> = {
  padding?: number;
  Clusterizer?: P &
    (new (
      left: P | ClusterizableLeaf,
      right: P | ClusterizableLeaf,
      options: O
    ) => P);

  ClusterMarker?: M &
    (new (latLng: LatLng, layers: SupportedMarker[], clusterizable: P) => M);
} & O;

export type FsacClusterizeOptions = {
  project: (layer: LatLng) => Point;
  unproject: (point: { x: number; y: number }) => LatLng;
};

export class FsacClustering<
  O extends object = ClusterizableCircleClusterOptions,
  P extends ClusterizablePair = ClusterizableCircleCluster,
  M extends CircleMarker | Marker = CircleClusterMarker,
> implements Clustering<FsacClusterizeOptions, M>
{
  private fsac: Fsac<P | ClusterizableLeaf>;
  private padding: number;
  private ClusterMarker: M &
    (new (latLng: LatLng, layers: SupportedMarker[], clusterizable: P) => M);
  private Clusterizer: P &
    (new (
      left: ClusterizableLeaf<any> | P,
      right: ClusterizableLeaf<any> | P,
      options: O
    ) => P);

  constructor(
    {
      Clusterizer = ClusterizableCircleCluster as any,
      ClusterMarker = CircleClusterMarker as any,
      ...options
    }: FsacClusteringOptions<O, P, M> = {} as any
  ) {
    (options as any).padding ??= 4;
    this.padding = options.padding!;
    this.Clusterizer = Clusterizer;
    this.ClusterMarker = ClusterMarker;

    //  - DivIcon custom could allow custom shapes, but that will render them size independent,
    //    and should only be used for CircleClusterMarker representations
    this.fsac = new Fsac({
      bbox: (item) => item.toPaddedBBox(),
      compareMinX: (a, b) => a.minX - b.minX,
      compareMinY: (a, b) => a.minY - b.minY,
      overlap: (a, b) => a.overlaps(b),
      merge: (a, b) => new Clusterizer(a, b, options as any),
    });
  }

  clusterize(
    markers: SupportedMarker[],
    { project, unproject }: FsacClusterizeOptions
  ): (M | SupportedMarker)[] {
    const leafs = markers.map(this.createLeaf(project));

    const clusters = this.fsac.clusterize(leafs);

    return clusters.map((c) => {
      if (c instanceof this.Clusterizer)
        // TODO: I think this should be moved farther up (to ClusterFeatureGroup) the instanceof is bound to ClusterizableCircleCluster but the clusterer could be different
        // I also think that it might be useful to be able to pass options tào the ClusterMarker when it's created...
        return new this.ClusterMarker(unproject(c), flatten(c), c);

      return (c as ClusterizableLeaf).data;
    });
  }

  createLeaf(project: (layer: LatLng) => Point) {
    return (marker: SupportedMarker) => {
      const { x, y } = project(marker.getLatLng());
      if (marker instanceof CircleMarker) {
        return new ClusterizableCircleLeaf(x, y, this.padding, marker);
      } else if (marker instanceof Marker) {
        return new ClusterizableRectangleLeaf(x, y, this.padding, marker);
      }

      throw new Error(
        'this type of marker is not supported, expected CirclerMarker or Marker'
      );
    };
  }
}
