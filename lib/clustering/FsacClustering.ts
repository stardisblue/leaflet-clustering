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

export type FsacClusteringOptions<O, P extends ClusterizablePair> = {
  padding?: number;
  Clusterer?: {
    new (
      left: P | ClusterizableLeaf,
      right: P | ClusterizableLeaf,
      options: O
    ): P;
  };
} & O;

export type FsacClusterizeOptions = {
  project: (layer: LatLng) => Point;
  unproject: (point: { x: number; y: number }) => LatLng;
};

export class FsacClustering<
  O extends object = ClusterizableCircleClusterOptions,
  P extends ClusterizablePair = ClusterizableCircleCluster,
> implements Clustering<FsacClusterizeOptions>
{
  private fsac: Fsac<P | ClusterizableLeaf>;
  private padding: number;

  constructor(
    {
      Clusterer = ClusterizableCircleCluster as any,
      ...options
    }: FsacClusteringOptions<O, P> = {} as any
  ) {
    (options as any).padding ??= 0;
    this.padding = options.padding as any;

    //  - DivIcon custom could allow custom shapes, but that will render them size independent,
    //    and should only be used for CircleClusterMarker representations
    this.fsac = new Fsac({
      bbox: (item) => item.toPaddedBBox(),
      compareMinX: (a, b) => a.minX - b.minX,
      compareMinY: (a, b) => a.minY - b.minY,
      overlap: (a, b) => a.overlaps(b),
      merge: (a, b) => new Clusterer(a, b, options as any),
    });
  }

  clusterize(
    markers: SupportedMarker[],
    { project, unproject }: FsacClusterizeOptions
  ): (CircleClusterMarker | SupportedMarker)[] {
    const leafs = markers.map(this.createLeaf(project));

    const clusters = this.fsac.clusterize(leafs);

    return clusters.map((c) => {
      if (c instanceof ClusterizableCircleCluster)
        return new CircleClusterMarker(unproject(c), flatten(c), {
          radius: c.r,
        });

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
