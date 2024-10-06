// @vitest-environment happy-dom

import { circleMarker, marker } from 'leaflet';
import { describe, expect, it } from 'vitest';

import { CircleClusterMarker } from '@/CircleClusterMarker';

describe('The radius is defined by the cluster', () => {
  it("gets it's radius from the cluster", () => {
    const cluster = { radius: 42 };
    const marker = new CircleClusterMarker([0, 0], [], cluster, {
      fillColor: 'red',
    });

    expect(marker.getRadius()).toBe(42);
  });

  it('ignores radius passed as an option', () => {
    const cluster = { radius: 5 };
    const marker = new CircleClusterMarker([0, 0], [], cluster, {
      fillColor: 'red',
      radius: 100,
    } as any);

    expect(marker.getRadius()).toBe(5);
  });
});

it('is possible to retrieve the markers contained in the cluster', () => {
  const markers = [
    circleMarker([0, 0], { radius: 10 }),
    marker([0, 0], { attribution: 'hello world' }),
  ];

  const cluster = new CircleClusterMarker([0, 0], markers, {
    radius: 10,
  });

  expect(cluster.getLayers()).toEqual(markers);
});
