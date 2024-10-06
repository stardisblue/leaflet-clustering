// @vitest-environment happy-dom

import { circleMarker, marker } from 'leaflet';
import { describe, expect, it } from 'vitest';

import { RoundDivClusterMarker } from '@/RoundDivClusterMarker';

const cluster = { radius: 42 };

describe('The size is defined by the cluster', () => {
  it('gets the iconSize based on radius', () => {
    const marker = new RoundDivClusterMarker([0, 0], [], cluster);

    expect(marker.getIcon().options.iconSize).toEqual([84, 84]);
  });

  it('ignores iconSize passed as an option', () => {
    const marker = new RoundDivClusterMarker([0, 0], [], cluster, {
      icon: () => ({ iconSize: [50, 50] }) as any,
    });

    expect(marker.getIcon().options.iconSize).toEqual([84, 84]);
  });
});

it('is possible to retrieve the markers contained in the cluster', () => {
  const markers = [
    circleMarker([0, 0], { radius: 10 }),
    marker([0, 0], { attribution: 'hello world' }),
  ];

  const rect = new RoundDivClusterMarker([0, 0], markers, cluster);

  expect(rect.getLayers()).toEqual(markers);
});
