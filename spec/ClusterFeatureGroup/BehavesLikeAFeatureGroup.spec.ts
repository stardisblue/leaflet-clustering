// @vitest-environment happy-dom

import { circleMarker, Map, map, marker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { NoClustering } from '@/clustering/NoClustering';

type Context = {
  cluster: ClusterFeatureGroup<NoClustering>;
  map: Map;
};

describe('Add ClusterFeatureGroup to Map', () => {
  beforeEach<Context>((context) => {
    context.map = map(document.createElement('div'));
    context.cluster = new ClusterFeatureGroup([], { method: NoClustering });
  });

  it('should work using map.addLayer(#)', ({ map, cluster }: Context) => {
    map.addLayer(cluster);

    expect(map.hasLayer(cluster)).toBe(true);
  });

  it('should work using #.addTo(map)', ({ map, cluster }: Context) => {
    cluster.addTo(map);

    expect(map.hasLayer(cluster)).toBe(true);
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
