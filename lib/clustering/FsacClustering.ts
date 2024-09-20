import { CircleMarker, LatLng, Point } from 'leaflet';
import { CircleClusterMarker } from '../CircleClusterMarker';
import type { Clustering } from './model';
import { Fsac } from '../fsac';
type Circle = {
  x: number;
  y: number;
  r: number;
  n: number;
};

type CircleDatum = Circle & {
  data: CircleMarker;
};

type CircleCluster = Circle & {
  children: (CircleCluster | CircleDatum)[];
};

export class FsacClustering implements Clustering {
  private _fsac: Fsac<CircleDatum | CircleCluster>;

  constructor({ padding = 0 }: FsacClusteringOptions = {}) {
this._fsac = new Fsac({
      bbox(circle) {
        return {
          minX: circle.x - circle.r - padding,
          minY: circle.y - circle.r - padding,
          maxX: circle.x + circle.r + padding,
          maxY: circle.y + circle.r + padding,
        };
      },
      compareMinX(a, b) {
        return a.x - a.r - (b.x - b.r);
      },
      compareMinY(a, b) {
        return a.y - a.r - (b.y - b.r);
      },
      overlap(a, b) {
        return (a.r + b.r + padding) ** 2 - ((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
      },
      merge(a, b) {
        const xs = a.x * a.n + b.x * b.n,
          ys = a.y * a.n + b.y * b.n,
          n = a.n + b.n;

        return {
          x: xs / n,
          y: ys / n,
          r: Math.sqrt(n),
          n,
          children: [a, b],
        };
      },
    });
  }

  clusterize(
    markers: CircleMarker[],
    project: (layer: LatLng) => Point,
    unproject: (point: { x: number; y: number }) => LatLng
  ): CircleClusterMarker[] {
    const circles: CircleDatum[] = markers.map((data) => {
      const { x, y } = project(data.getLatLng());
      return {
        x,
        y,
        r: data.getRadius(),
        n: data.getRadius() ** 2,
        data,
      };
    });

    const clusters = this._fsac.clusterize(circles);

    return clusters.map(
      (c) =>
        new CircleClusterMarker(unproject(c), flatten(c), {
          radius: c.r,
        })
    );
  }
}

function flatten(cluster: CircleCluster | CircleDatum) {
  function loop(acc: CircleMarker[], stack: (CircleCluster | CircleDatum)[]) {
    if (stack.length === 0) return acc;

    const head = stack.shift()!;

    if (isDatum(head)) acc.push(head.data);
    else stack.push(...head.children);

    return loop(acc, stack);
  }

  return loop([], [cluster]);
}

function isDatum(cluster: CircleCluster | CircleDatum): cluster is CircleDatum {
  return (cluster as CircleDatum).data !== undefined;
}
