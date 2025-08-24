import { CircleMarker, LatLng, Marker, Point } from 'leaflet';

import { flatten } from '@/binary-tree-traversal';
import { CircleClusterMarker, SupportedMarker } from '@/CircleClusterMarker';
import { Fsac } from '@/fsac';

import { CircleCluster, CircleLeaf } from '@/shape/Circle';
import { RectangleLeaf } from '@/shape/Rectangle';
import { ShapedCluster, ShapedLeaf } from '@/shape/Shape';
import type { ClusteringMethod, ClusterizeOptions } from './model';

type ShapedClusterConstructor<S extends ShapedCluster, O = any> = new (
  left: S | ShapedLeaf,
  right: S | ShapedLeaf,
  options: O
) => S;

type ClusterMarkerConstructor<
  S extends ShapedCluster,
  M extends SupportedMarker,
  O = any,
> = new (
  latLng: LatLng,
  layers: SupportedMarker[],
  cluster: S,
  options?: O
) => M;

type ShapedClusterOptions<S> =
  S extends ShapedClusterConstructor<any, infer O> ? O : never;

type ClusterMarkerOptions<C> =
  C extends ClusterMarkerConstructor<any, any, infer O> ? O : never;

export type FsacClusteringOptions<
  S extends ShapedClusterConstructor<any>,
  C extends ClusterMarkerConstructor<InstanceType<S>, any>,
> = {
  padding?: number;
  ShapedCluster?: S;
  shapedClusterOptions?: Omit<ShapedClusterOptions<S>, 'padding'>;
  ClusterMarker?: C;
  clusterMarkerOptions?: ClusterMarkerOptions<C>;
};

export class FsacClustering<
  S extends ShapedClusterConstructor<any> = typeof CircleCluster,
  C extends ClusterMarkerConstructor<
    InstanceType<S>,
    any
  > = typeof CircleClusterMarker,
> implements ClusteringMethod<InstanceType<C>>
{
  private fsac: Fsac<ShapedCluster | ShapedLeaf>;
  private ShapedCluster: S;
  private ClusterMarker: C;
  options: Omit<FsacClusteringOptions<S, C>, 'ShapedCluster' | 'ClusterMarker'>;

  constructor({
    ShapedCluster = CircleCluster as any,
    ClusterMarker = CircleClusterMarker as any,
    ...options
  }: FsacClusteringOptions<S, C> = {}) {
    options.padding ??= 4;
    this.options = options;
    this.ShapedCluster = ShapedCluster;
    this.ClusterMarker = ClusterMarker;

    this.fsac = new Fsac({
      bbox: (item) => item.toPaddedBBox(options.padding!),
      compareMinX: (a, b) => a.minX - b.minX,
      compareMinY: (a, b) => a.minY - b.minY,
      overlap: (a, b) => a.overlaps(b, options.padding!),
      merge: (a, b) =>
        new ShapedCluster(a, b, {
          ...(options.shapedClusterOptions ?? {}),
          padding: this.options.padding,
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
      if (c instanceof this.ShapedCluster)
        // TODO: I think this should be moved further up (to ClusterFeatureGroup)
        return new this.ClusterMarker(
          unproject(c),
          flatten(c),
          c as InstanceType<S>,
          this.options.clusterMarkerOptions
        );

      return (c as ShapedLeaf).data;
    });
  }

  createLeaf(project: (layer: LatLng) => Point) {
    return (marker: SupportedMarker) => {
      const { x, y } = project(marker.getLatLng());
      if (marker instanceof CircleMarker) {
        return new CircleLeaf(x, y, marker);
      } else if (marker instanceof Marker) {
        return new RectangleLeaf(x, y, marker);
      }

      throw new Error(
        'this type of marker is not supported, expected CirclerMarker or Marker'
      );
    };
  }
}
