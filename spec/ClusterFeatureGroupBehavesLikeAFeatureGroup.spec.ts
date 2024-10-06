// @vitest-environment happy-dom

import { circleMarker, map, marker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { NoClustering } from '@/clustering/NoClustering';

describe('Add ClusterFeatureGroup to Map', () => {
  let leafletMap: ReturnType<typeof map>;
  let cluster: ClusterFeatureGroup<NoClustering>;

  beforeEach(() => {
    leafletMap = map(document.createElement('div'));
    cluster = new ClusterFeatureGroup([], { method: NoClustering });
  });

  it('should work using map.addLayer(#)', () => {
    leafletMap.addLayer(cluster);

    expect(leafletMap.hasLayer(cluster)).toBe(true);
  });

  it('should work using #.addTo(map)', () => {
    cluster.addTo(leafletMap);

    expect(leafletMap.hasLayer(cluster)).toBe(true);
  });
});

it('should accept markers and circle markers', () => {
  const markers = [circleMarker([0, 0]), marker([0, 0])];
  const cluster = new ClusterFeatureGroup(markers, { method: NoClustering });
  map(document.createElement('div')).setView([48.9, 2.3], 3).addLayer(cluster);

  expect(cluster.getLayers()).toEqual(markers);
});

it.todo('should be possible to add layers');
it.todo('should be possible to remove layers');
