import { scaleSqrt } from 'd3-scale';
import { CircleMarker, LatLng, Marker, Point } from 'leaflet';
import { flatten } from '../binary-tree-traversal';
import { CircleClusterMarker } from '../CircleClusterMarker';
import { Fsac } from '../fsac';
import type { Clustering, SupportedMarker } from './model';
import { CircleCluster, CircleLeaf, RectangleLeaf } from './overlap';

type FsacClusteringOptions = {
  padding?: number;
  scale?: (weight: number) => number;
  weight?: (marker: SupportedMarker) => number;
  baseRadius?: number;
};

export class FsacClustering implements Clustering {
  private fsac: Fsac<CircleLeaf | RectangleLeaf | CircleCluster>;
  private getWeight: any;
  private padding: number;

  constructor({
    padding = 0,
    scale = scaleSqrt(),
    weight = () => 1,
    baseRadius: baseSize = 10,
  }: FsacClusteringOptions = {}) {
    this.getWeight = weight;
    this.padding = padding;
    // there is only 2 kinds of Markers
    //- CircleMarkers: props: x, y, r
    //- Markers: icon bbox. The default icon has all the necessary information to generate an accurate collision model
    //  - DivIcon custom could allow custom shapes, but that will render them size independent,
    //    and should only be used for CircleClusterMarker representations
    this.fsac = new Fsac({
      bbox(item) {
        return item.toPaddedBBox();
      },
      compareMinX(a, b) {
        return a.minX - b.minX;
      },
      compareMinY(a, b) {
        return a.minY - b.minY;
      },
      overlap(a, b) {
        return a.overlaps(b);
      },
      merge(a, b) {
        const w = a.w + b.w;
        const x = (a.x * a.w + b.x * b.w) / w;
        const y = (a.y * a.w + b.y * b.w) / w;
        const r = scale(w) + baseSize;
        return new CircleCluster(x, y, r, w, padding, a, b);
      },
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
      if (c instanceof CircleCluster)
        return new CircleClusterMarker(unproject(c), flatten(c), {
          radius: c.r,
        });

      return c.data;
    });
  }

  createLeaf(project: (layer: LatLng) => Point) {
    return (marker: SupportedMarker) => {
      const { x, y } = project(marker.getLatLng());
      if (marker instanceof CircleMarker) {
        return new CircleLeaf(
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
        return new RectangleLeaf(
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
        'this typeof marker is not supported, expected CirclerMarker or Marker '
      );
    };
  }
}
