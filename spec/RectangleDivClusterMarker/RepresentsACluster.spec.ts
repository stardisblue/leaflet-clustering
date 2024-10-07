import { circleMarker, marker } from 'leaflet';
import { describe, expect, it } from 'vitest';

import { RectangleDivClusterMarker } from '@/RectangleDivClusterMarker';

const cluster = { minX: 10, minY: 10, maxX: 20, maxY: 20 };

describe('The size is defined by the cluster', () => {
  it('gets the iconSize based on cluster dimensions', () => {
    const marker = new RectangleDivClusterMarker([0, 0], [], cluster);

    expect(marker.getIcon().options.iconSize).toEqual([10, 10]);
  });

  it('ignores iconSize passed as an option', () => {
    const marker = new RectangleDivClusterMarker([0, 0], [], cluster, {
      icon: () => ({ iconSize: [50, 50] }) as any,
    });

    expect(marker.getIcon().options.iconSize).toEqual([10, 10]);
  });
});

it('is possible to retrieve the markers contained in the cluster', () => {
  const markers = [
    circleMarker([0, 0], { radius: 10 }),
    marker([0, 0], { attribution: 'hello world' }),
  ];

  const rect = new RectangleDivClusterMarker([0, 0], markers, cluster);

  expect(rect.getLayers()).toEqual(markers);
});
