import { CircleMarker, LatLng, Marker, Point } from 'leaflet';

import { flatten } from '@/binary-tree-traversal';
import {
  CircleClusterMarker,
  CircleClusterMarkerOptions,
  SupportedMarker,
} from '@/CircleClusterMarker';
import { Fsac } from '@/fsac';

import { CircleCluster, CircleClusterOptions, CircleLeaf } from './Circle';
import type {
  ClusteringMethod,
  ClusterizeOptions,
  SpatialCluster,
  SpatialLeaf,
} from './model';
import { RectangleLeaf } from './Rectangle';

type SpatialClusterConstructor<P extends SpatialCluster, O = any> = new (
  left: P | SpatialLeaf,
  right: P | SpatialLeaf,
  options: O
) => P;

type ClusterMarkerConstructor<
  P extends SpatialCluster,
  M extends SupportedMarker,
  O = any,
> = new (
  latLng: LatLng,
  layers: SupportedMarker[],
  cluster: P,
  options?: O
) => M;

type SpatialClusterOptions<S> =
  S extends SpatialClusterConstructor<any, infer O> ? O : never;

type ClusterMarkerOptions<C> =
  C extends ClusterMarkerConstructor<any, any, infer O> ? O : never;

export type FsacClusteringOptions<
  S extends SpatialClusterConstructor<any>,
  C extends ClusterMarkerConstructor<InstanceType<S>, any>,
> = {
  padding?: number;
  SpatialCluster?: S;
  spatialClusterOptions?: Omit<SpatialClusterOptions<S>, 'padding'>;
  ClusterMarker?: C;
  clusterMarkerOptions?: ClusterMarkerOptions<C>;
};

export class FsacClustering<
  S extends SpatialClusterConstructor<any> = SpatialClusterConstructor<
    CircleCluster,
    CircleClusterOptions
  >,
  C extends ClusterMarkerConstructor<
    InstanceType<S>,
    any
  > = ClusterMarkerConstructor<
    InstanceType<S>,
    CircleClusterMarker,
    CircleClusterMarkerOptions
  >,
> implements ClusteringMethod<InstanceType<C>>
{
  private fsac: Fsac<SpatialCluster | SpatialLeaf>;
  private padding: number;
  private SpatialCluster: S;
  private ClusterMarker: C;
  options: Omit<FsacClusteringOptions<S, C>, 'Clusterizer' | 'ClusterMarker'>;

  constructor({
    SpatialCluster = CircleCluster as any,
    ClusterMarker = CircleClusterMarker as any,
    ...options
  }: FsacClusteringOptions<S, C> = {}) {
    options.padding ??= 4;
    this.padding = options.padding;
    this.options = options;
    this.SpatialCluster = SpatialCluster;
    this.ClusterMarker = ClusterMarker;

    //  - DivIcon custom could allow custom shapes, but that will render them size independent,
    //    and should only be used for CircleClusterMarker representations
    this.fsac = new Fsac({
      bbox: (item) => item.toPaddedBBox(),
      compareMinX: (a, b) => a.minX - b.minX,
      compareMinY: (a, b) => a.minY - b.minY,
      overlap: (a, b) => a.overlaps(b),
      merge: (a, b) =>
        new SpatialCluster(a, b, {
          ...(options.spatialClusterOptions ?? {}),
          padding: this.padding,
        }),
    });
  }

  clusterize(
    markers: SupportedMarker[],
    { project, unproject }: ClusterizeOptions
  ): InstanceType<C>[] {
    const leafs = markers.map(this.createLeaf(project));

    const clusters = this.fsac.clusterize(leafs);

    return clusters.map((c) => {
      if (c instanceof this.SpatialCluster)
        // TODO: I think this should be moved further up (to ClusterFeatureGroup)
        return new this.ClusterMarker(
          unproject(c),
          flatten(c),
          c as InstanceType<S>,
          this.options.clusterMarkerOptions
        );

      return (c as SpatialLeaf).data;
    });
  }

  createLeaf(project: (layer: LatLng) => Point) {
    return (marker: SupportedMarker) => {
      const { x, y } = project(marker.getLatLng());
      if (marker instanceof CircleMarker) {
        return new CircleLeaf(x, y, this.padding, marker);
      } else if (marker instanceof Marker) {
        return new RectangleLeaf(x, y, this.padding, marker);
      }

      throw new Error(
        'this type of marker is not supported, expected CirclerMarker or Marker'
      );
    };
  }
}
