import { describe, expect, it } from 'vitest';

import flat from '../../spec/assets/flat.json';
import { Fsac } from '.';

type CircleCluster = {
  x: number;
  y: number;
  r: number;
  n: number;
  children: any[];
};

describe('fsac', () => {
  it('should not regress from initial reference', () => {
    const clusterer = new Fsac<CircleCluster>({
      bbox(circle) {
        return {
          minX: circle.x - circle.r,
          minY: circle.y - circle.r,
          maxX: circle.x + circle.r,
          maxY: circle.y + circle.r,
        };
      },
      compareMinX(a, b): number {
        return a.x - a.r - (b.x - b.r);
      },
      compareMinY(a, b): number {
        return a.y - a.r - (b.y - b.r);
      },
      overlap(a, b): number {
        return (a.r + b.r) ** 2 - ((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
      },
      merge(a, b) {
        const xs = a.x * a.n + b.x * b.n,
          ys = a.y * a.n + b.y * b.n,
          n = a.n + b.n;

        return { x: xs / n, y: ys / n, r: Math.sqrt(n), n, children: [a, b] };
      },
    });

    expect(clusterer.clusterize(flat)).toMatchSnapshot();
  });
});
