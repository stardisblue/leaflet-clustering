import { circleMarker, map, marker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { NoClustering } from '@/clustering/NoClustering';

let leafletMap: ReturnType<typeof map>;
let markers: SupportedMarker[];

beforeEach(async () => {
  markers = [circleMarker([0, 0]), marker([50, 50])];

  document.body.innerHTML = `<div id="map" style="width: 500px; height: 500px"></div>`;
  3;
  const $div: HTMLElement = document.querySelector('#map')!;

  leafletMap = map($div).setView([1, 1], 10);
});

describe('Cluster visible markers only', () => {
  it('should behave like before by default', () => {
    const cluster = new ClusterFeatureGroup(markers, { method: NoClustering });
    leafletMap.addLayer(cluster);

    expect(cluster.getLayers()).toEqual(markers);
  });

  it('should restrict to markers in bounds', () => {
    const cluster = new ClusterFeatureGroup(markers, {
      method: NoClustering,
      restrictToVisibleBounds: true,
    });

    leafletMap.addLayer(cluster);

    expect(cluster.getLayers()).toEqual([markers[0]]);
  });
});

it('should update visible markers and cluster again when moved', () => {
  const cluster = new ClusterFeatureGroup(markers, {
    method: NoClustering,
    restrictToVisibleBounds: true,
  });

  leafletMap.addLayer(cluster);
  expect(cluster.getLayers()).toEqual([markers[0]]);

  leafletMap.setView([50, 50]);
  expect(cluster.getLayers()).toEqual([markers[1]]);
});
