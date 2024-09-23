import { scaleSqrt } from 'd3-scale';
import { CircleMarker, LatLng, Marker, Point } from 'leaflet';
import { flatten } from '../binary-tree-traversal';
import { CircleClusterMarker, SupportedMarker } from '../CircleClusterMarker';
import { Fsac } from '../fsac';
import {
  ClusterizableCircleCluster,
  ClusterizableCircleLeaf,
} from './ClusterizableCircle';
import { ClusterizableRectangleLeaf } from './ClusterizableRectangle';
import type { Clustering, ClusterizableLeaf, ClusterizablePair } from './model';

type FsacClusteringOptions = {
  padding?: number;
  scale?: (weight: number) => number;
  weight?: (marker: SupportedMarker) => number;
  baseRadius?: number;
};

export class FsacClustering implements Clustering {
  private fsac: Fsac<ClusterizableLeaf | ClusterizablePair>;
  private getWeight: any;
  private padding: number;

  constructor({
    padding = 0,
    scale = scaleSqrt(),
    weight = () => 1,
    baseRadius = 10,
  }: FsacClusteringOptions = {}) {
    this.getWeight = weight;
    this.padding = padding;
    // there is only 2 kinds of Markers
    //  - DivIcon custom could allow custom shapes, but that will render them size independent,
    //    and should only be used for CircleClusterMarker representations
    this.fsac = new Fsac({
      bbox: (item) => item.toPaddedBBox(),
      compareMinX: (a, b) => a.minX - b.minX,
      compareMinY: (a, b) => a.minY - b.minY,
      overlap: (a, b) => a.overlaps(b),
      merge: (a, b) =>
        new ClusterizableCircleCluster(a, b, padding, scale, baseRadius),
    });
  }

  clusterize(
    markers: SupportedMarker[],
    project: (layer: LatLng) => Point,
    unproject: (point: { x: number; y: number }) => LatLng
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
        return new ClusterizableCircleLeaf(
          x,
          y,
          marker.getRadius(),
          this.getWeight(marker),
          this.padding,
          marker
        );
      } else if (marker instanceof Marker) {
        const icon = marker.getIcon();

        if (
          icon.options.iconSize === undefined ||
          icon.options.iconAnchor === undefined
        ) {
          throw new Error('iconSize or iconAnchor is not defined');
        }

        const [xAnchor, yAnchor] = icon.options.iconAnchor as number[];
        const minX = x - xAnchor;
        const minY = y - yAnchor;
        const [width, height] = icon.options.iconSize as number[];
        return new ClusterizableRectangleLeaf(
          x,
          y,
          minX,
          minY,
          minX + width,
          minY + height,
          this.getWeight(marker),
          this.padding,
          marker
        );
      }

      throw new Error(
        'this type of marker is not supported, expected CirclerMarker or Marker'
      );
    };
  }
}
