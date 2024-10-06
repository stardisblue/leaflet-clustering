import { circleMarker, Map, map, marker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { NoClustering } from '@/clustering/NoClustering';

type Context = {
  map: Map;
  markers: SupportedMarker[];
};

beforeEach(async (context: Context) => {
  context.markers = [circleMarker([0, 0]), marker([50, 50])];

  document.body.innerHTML = `<div id="map" style="width: 500px; height: 500px"></div>`;
  3;
  const $div: HTMLElement = document.querySelector('#map')!;

  context.map = map($div).setView([1, 1], 10);
});

describe('Cluster visible markers only', () => {
  it('should behave like before by default', ({ markers, map }: Context) => {
    const cluster = new ClusterFeatureGroup(markers, { method: NoClustering });
    map.addLayer(cluster);

    expect(cluster.getLayers()).toEqual(markers);
  });

  it('should restrict to markers in bounds', ({ markers, map }: Context) => {
    const cluster = new ClusterFeatureGroup(markers, {
      method: NoClustering,
      restrictToVisibleBounds: true,
    });

    map.addLayer(cluster);

    expect(cluster.getLayers()).toEqual([markers[0]]);
  });
});

it('should update visible markers and cluster again when moved', ({
  markers,
  map,
}: Context) => {
  const cluster = new ClusterFeatureGroup(markers, {
    method: NoClustering,
    restrictToVisibleBounds: true,
  });

  map.addLayer(cluster);
  expect(cluster.getLayers()).toEqual([markers[0]]);

  map.setView([50, 50]);
  expect(cluster.getLayers()).toEqual([markers[1]]);
});
