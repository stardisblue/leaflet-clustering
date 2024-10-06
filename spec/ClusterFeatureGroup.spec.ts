// @vitest-environment happy-dom

import { circleMarker, Map, map, marker } from 'leaflet';
import { beforeEach, expect, it, vi } from 'vitest';

import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';

type Context = {
  map: Map;
};

beforeEach<Context>((context) => {
  context.map = map(document.createElement('div'));
});

(it<Context>).for([
  {
    name: 'circleMarker & circleMarker',
    markers: [
      circleMarker([44.14155, 6.82979]),
      circleMarker([44.0816, 7.90522]),
    ],
    base: 5,
    updated: 4,
  },
  {
    name: 'CircleMarker and Maker',
    markers: [marker([44.14155, 6.82979]), circleMarker([44.0816, 7.90522])],
    base: 6,
    updated: 5,
  },
  {
    name: 'Maker and Maker',
    markers: [marker([44.14155, 6.82979]), marker([44.0816, 7.90522])],
    base: 6,
    updated: 5,
  },

  {
    name: 'Maker and CircleCluster',
    markers: [
      marker([44.14155, 6.82979]),
      marker([44.0816, 7.90522]),
      marker([44.0816, 7.90522]),
    ],
    base: 6,
    updated: 5,
  },
  {
    name: 'CircleMarker and CircleCluster',
    markers: [
      circleMarker([44.14155, 6.82979]),
      marker([44.0816, 7.90522]),
      marker([44.0816, 7.90522]),
    ],
    base: 6,
    updated: 5,
  },
  {
    name: 'CircleCluster and CircleCluster',
    markers: [
      marker([44.14155, 6.82979]),
      marker([44.14155, 6.82979]),
      marker([44.0816, 7.90522]),
      marker([44.0816, 7.90522]),
    ],
    base: 6,
    updated: 5,
  },
])(
  'should clusterize $name',
  async ({ markers, base, updated }, { map }: any) => {
    map.setView([48.9, 2.3], base);
    const cluster = new ClusterFeatureGroup(markers);
    cluster.addTo(map);

    await vi.waitFor(() => cluster.getLayers().length == 2);
    expect(cluster.getLayers().length).toBe(2);
    map.setZoom(updated);
    expect(cluster.getLayers().length).toBe(1);
  }
);
