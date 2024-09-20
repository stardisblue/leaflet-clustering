import { CircleMarker, LatLng, Point } from 'leaflet';
import { CircleClusterMarker } from './CircleClusterMarker';
import { ClusteringAlgorithm } from './ClusteringAlgorithm';
import { Fsac } from './fsac';
type Circle = {
  x: number;
  y: number;
  r: number;
  n: number;
};
type CircleDatum = Circle & {
  datum: CircleMarker;
};
type CircleCluster = Circle & {
  children: (CircleCluster | CircleDatum)[];
};

export class FsacClusteringAlgorithm implements ClusteringAlgorithm {
  private _fsac: Fsac<CircleDatum | CircleCluster>;
  constructor() {
    this._fsac = new Fsac<CircleDatum | CircleCluster>({
      bbox(circle) {
        return {
          minX: circle.x - circle.r,
          minY: circle.y - circle.r,
          maxX: circle.x + circle.r,
          maxY: circle.y + circle.r,
        };
      },
      compareMinX(a, b) {
        return a.x - a.r - (b.x - b.r);
      },
      compareMinY(a, b) {
        return a.y - a.r - (b.y - b.r);
      },
      overlap(a, b) {
        return (a.r + b.r) ** 2 - ((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
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
    const circles: CircleDatum[] = markers.map((m) => {
      const { x, y } = project(m.getLatLng());
      return {
        x,
        y,
        r: m.getRadius(),
        n: m.getRadius() * m.getRadius(),
        datum: m,
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

    if (isDatum(head)) acc.push(head.datum);
    else stack.push(...head.children);

    return loop(acc, stack);
  }

  return loop([], [cluster]);
}

function isDatum(cluster: CircleCluster | CircleDatum): cluster is CircleDatum {
  return (cluster as CircleDatum).datum !== undefined;
}
