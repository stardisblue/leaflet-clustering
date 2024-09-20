import { ref } from './ref';
import { rBush, RbushOptions } from './rBush';

export type FsacOptions<T> = RbushOptions<T> & {
  overlap: (a: T, b: T) => number;
  merge: (a: T, b: T) => T;
};

export type FsacRunOptions = {
  brk?: boolean;
  reverse?: boolean;
  sort?: boolean;
};

export class Fsac<T> {
  private _overlap: (a: T, b: T) => number;
  private _merge: (a: T, b: T) => T;
  private _rbushOptions: RbushOptions<T>;

  constructor({ overlap, merge, ...rBushOptions }: FsacOptions<T>) {
    this._rbushOptions = rBushOptions as RbushOptions<T>;
    this._overlap = overlap;
    this._merge = merge;
  }

  clusterize(
    clusters: T[],
    { brk = false, reverse = false, sort = true }: FsacRunOptions = {}
  ) {
    const µ_clusters = clusters.map(ref);

    const collision = rBush(this._rbushOptions);
    collision.load(µ_clusters);

    const µ_alives = new Set(µ_clusters);
    for (const µ_cluster of µ_alives) {
      let updated = false;
      let clustered = true;
      let cluster = µ_cluster.current;

      while (clustered) {
        clustered = false;
        const µ_candidates = collision.search(collision.toBBox(µ_cluster));

        const indexes = new Uint32Array(µ_candidates.length);
        {
          // unloads overlaps as soon as it's not used
          const overlaps = new Float64Array(µ_candidates.length);
          for (let i = 0; i < µ_candidates.length; i++) {
            indexes[i] = i;
            overlaps[i] = this._overlap(cluster, µ_candidates[i].current);
          }
          if (sort) indexes.sort((a, b) => overlaps[b] - overlaps[a]);
        }

        const iterated = reverse ? indexes.reverse() : indexes;

        for (const i of iterated) {
          const µ_candidate = µ_candidates[i];
          if (µ_cluster === µ_candidate) continue;

          if (this._overlap(cluster, µ_candidate.current) > 0) {
            if (!updated) updated = true;

            cluster = this._merge(cluster, µ_candidate.current);
            µ_alives.delete(µ_candidate);
            collision.remove(µ_candidate);
            if (!clustered) clustered = true;
            if (brk) break;
          }
        }
      }
      if (updated) {
        collision.remove(µ_cluster);
        µ_cluster.current = cluster;
        collision.insert(µ_cluster);
      }
    }

    return Array.from(µ_alives, ({ current }) => current);
  }
}

type CircleCluster = {
  x: number;
  y: number;
  r: number;
  n: number;
  children: any[];
};

export function fsac(clusters: CircleCluster[], options?: FsacRunOptions) {
  const clusterer = new Fsac({
    bbox,
    compareMinX,
    compareMinY,
    overlap,
    merge,
  });

  return clusterer.clusterize(clusters, options);

  function bbox(circle: CircleCluster) {
    return {
      minX: circle.x - circle.r,
      minY: circle.y - circle.r,
      maxX: circle.x + circle.r,
      maxY: circle.y + circle.r,
    };
  }

  function compareMinX(a: CircleCluster, b: CircleCluster): number {
    return a.x - a.r - (b.x - b.r);
  }

  function compareMinY(a: CircleCluster, b: CircleCluster): number {
    return a.y - a.r - (b.y - b.r);
  }

  function overlap(a: CircleCluster, b: CircleCluster): number {
    return (a.r + b.r) ** 2 - ((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  function merge(a: CircleCluster, b: CircleCluster): CircleCluster {
    const xs = a.x * a.n + b.x * b.n,
      ys = a.y * a.n + b.y * b.n,
      n = a.n + b.n;

    return { x: xs / n, y: ys / n, r: Math.sqrt(n), n, children: [a, b] };
  }
}
