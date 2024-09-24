import { CircleMarker, LatLng, Marker, Point } from 'leaflet';
import { flatten } from '../binary-tree-traversal';
import {
  CircleClusterMarker,
  CircleClusterMarkerOptions,
  SupportedMarker,
} from '../CircleClusterMarker';
import { Fsac } from '../fsac';
import {
  ClusterizableCircleCluster,
  ClusterizableCircleClusterOptions,
  ClusterizableCircleLeaf,
} from './ClusterizableCircle';
import { ClusterizableRectangleLeaf } from './ClusterizableRectangle';
import type { Clustering, ClusterizableLeaf, ClusterizablePair } from './model';

export type FsacClusteringOptions<
  P extends ClusterizablePair,
  OP,
  M extends SupportedMarker,
  OM,
> = {
  padding?: number;
  Clusterizer?: P &
    (new (
      left: P | ClusterizableLeaf,
      right: P | ClusterizableLeaf,
      options: OP
    ) => P);
  clusterizerOptions?: Omit<OP, 'padding'>;
  ClusterMarker?: M &
    (new (
      latLng: LatLng,
      layers: SupportedMarker[],
      clusterizable: P,
      options?: OM
    ) => M);
  clusterMarkerOptions?: OM;
};

export type FsacClusterizeOptions = {
  project: (layer: LatLng) => Point;
  unproject: (point: { x: number; y: number }) => LatLng;
};

export class FsacClustering<
  P extends ClusterizablePair = ClusterizableCircleCluster,
  OP = ClusterizableCircleClusterOptions,
  M extends CircleMarker | Marker = CircleClusterMarker,
  OM = CircleClusterMarkerOptions,
> implements Clustering<FsacClusterizeOptions, M>
{
  private fsac: Fsac<P | ClusterizableLeaf>;
  private padding: number;
  private ClusterMarker: M &
    (new (
      latLng: LatLng,
      layers: SupportedMarker[],
      clusterizable: P,
      options?: OM
    ) => M);
  private Clusterizer: P &
    (new (
      left: ClusterizableLeaf<any> | P,
      right: ClusterizableLeaf<any> | P,
      options: OP
    ) => P);
  options: Omit<
    FsacClusteringOptions<P, OP, M, OM>,
    'Clusterizer' | 'ClusterMarker'
  >;

  constructor({
    Clusterizer = ClusterizableCircleCluster as any,
    ClusterMarker = CircleClusterMarker as any,
    ...options
  }: FsacClusteringOptions<P, OP, M, OM> = {}) {
    options.padding ??= 4;
    this.padding = options.padding;
    this.options = options;
    this.Clusterizer = Clusterizer;
    this.ClusterMarker = ClusterMarker;

    //  - DivIcon custom could allow custom shapes, but that will render them size independent,
    //    and should only be used for CircleClusterMarker representations
    this.fsac = new Fsac({
      bbox: (item) => item.toPaddedBBox(),
      compareMinX: (a, b) => a.minX - b.minX,
      compareMinY: (a, b) => a.minY - b.minY,
      overlap: (a, b) => a.overlaps(b),
      merge: (a, b) =>
        new Clusterizer(
          a,
          b,
          options.clusterizerOptions
            ? {
                ...options.clusterizerOptions,
                padding: this.padding,
              }
            : ({ padding: this.padding } as any)
        ),
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
        // TODO: I think this should be moved farther up (to ClusterFeatureGroup)
        return new this.ClusterMarker(
          unproject(c),
          flatten(c),
          c,
          this.options.clusterMarkerOptions
        );

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
