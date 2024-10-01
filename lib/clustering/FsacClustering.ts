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
import type {
  Clustering,
  ClusteringOptions,
  ClusterizableLeaf,
  ClusterizablePair,
} from './model';

type ClusterizablePairCtor<P extends ClusterizablePair, O = any> = new (
  left: P | ClusterizableLeaf,
  right: P | ClusterizableLeaf,
  options: O
) => P;

type ClusterMarkerCtor<
  M extends SupportedMarker,
  P extends ClusterizablePair,
  O = any,
> = new (
  latLng: LatLng,
  layers: SupportedMarker[],
  clusterizable: P,
  options?: O
) => M;

type ClusterizablePairOptions<P extends ClusterizablePairCtor<any>> =
  P extends ClusterizablePairCtor<any, infer O> ? O : never;

type ClusterMarkerOptions<P extends ClusterMarkerCtor<any, any>> =
  P extends ClusterMarkerCtor<any, any, infer O> ? O : never;

export type FsacClusteringOptions<
  P extends ClusterizablePairCtor<any>,
  M extends ClusterMarkerCtor<any, InstanceType<P>>,
> = {
  padding?: number;
  Clusterizer?: P;
  clusterizerOptions?: ClusterizablePairOptions<P>;
  ClusterMarker?: M;
  clusterMarkerOptions?: ClusterMarkerOptions<M>;
};

export class FsacClustering<
  P extends ClusterizablePairCtor<any, any> = ClusterizablePairCtor<
    ClusterizableCircleCluster,
    ClusterizableCircleClusterOptions
  >,
  M extends ClusterMarkerCtor<any, InstanceType<P>, any> = ClusterMarkerCtor<
    CircleClusterMarker,
    InstanceType<P>,
    CircleClusterMarkerOptions
  >,
> implements Clustering<InstanceType<M>>
{
  private fsac: Fsac<ClusterizablePair | ClusterizableLeaf>;
  private padding: number;
  private ClusterMarker: M;
  private Clusterizer: P;
  options: Omit<FsacClusteringOptions<P, M>, 'Clusterizer' | 'ClusterMarker'>;

  constructor({
    Clusterizer = ClusterizableCircleCluster as P,
    ClusterMarker = CircleClusterMarker as any,
    ...options
  }: FsacClusteringOptions<P, M> = {}) {
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
        new Clusterizer(a, b, {
          ...(options.clusterizerOptions ?? {}),
          padding: this.padding,
        }),
    });
  }

  clusterize(
    markers: SupportedMarker[],
    { project, unproject }: ClusteringOptions
  ): InstanceType<M>[] {
    const leafs = markers.map(this.createLeaf(project));

    const clusters = this.fsac.clusterize(leafs);

    return clusters.map((c) => {
      if (c instanceof this.Clusterizer)
        // TODO: I think this should be moved farther up (to ClusterFeatureGroup)
        return new this.ClusterMarker(
          unproject(c),
          flatten(c),
          c as InstanceType<P>,
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
