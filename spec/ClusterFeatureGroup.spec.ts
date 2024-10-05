import { circleMarker, CircleMarker, Map, map, marker } from 'leaflet';
import { beforeEach, expect, it, vi } from 'vitest';

import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';

type Context = {
  markers: CircleMarker[];
  map: Map;
};

beforeEach<Context>((context) => {
  context.markers = [
    { id: 'frs', lat: 52, lng: 7 },
    { id: 'frr', lat: 54, lng: 8 },
    { id: 'frq', lat: -5, lng: 146 },
    { id: 'frp', lat: 45, lng: 6 },
    { id: 'frt', lat: -15, lng: 176 },
    { id: 'fry', lat: 55, lng: 5 },
  ].map((m) => circleMarker(m));

  document.body.innerHTML = '<div id="map"></div>';
  context.map = map(document.getElementById('map') as any as HTMLElement);
});

it<Context>('should use FSAC for creating clusters', async ({
  markers,
  map,
}) => {
  map.setView([48.9, 2.3], 3);
  const cluster = new ClusterFeatureGroup(markers, { padding: 0 });
  cluster.addTo(map);
  await vi.waitFor(() => cluster.getLayers().length > 0);

  expect(cluster.getLayers().length).toBe(5);
});

it<Context>('should update clustering depending on zoomlevel', async ({
  markers,
  map,
}) => {
  map.setView([48.9, 2.3], 3);
  const cluster = new ClusterFeatureGroup(markers, { padding: 0 });
  cluster.addTo(map);

  await vi.waitFor(() => cluster.getLayers().length > 0);

  expect(cluster.getLayers().length).toBe(5);
  map.setZoom(1);
  expect(cluster.getLayers().length).toBe(3);
});

it<Context>('should update clustering depending on radius', async ({
  markers,
  map,
  expect,
}) => {
  map.setView([48.9, 2.3], 3);
  markers.forEach((m) => m.setRadius(30));
  const cluster = new ClusterFeatureGroup(markers, { padding: 0 });

  await vi.waitFor(() => cluster.getLayers().length > 0);

  cluster.addTo(map);

  expect(cluster.getLayers().length).toBe(4);
});

it<Context>('should disable clustering when removed from map', async ({
  markers,
  map,
}) => {
  map.setView([48.9, 2.3], 3);
  const cluster = new ClusterFeatureGroup(markers, { padding: 0 });
  cluster.addTo(map);

  await vi.waitFor(() => cluster.getLayers().length > 0);
  expect(cluster.getLayers().length).toBe(5);

  map.removeLayer(cluster);

  expect(cluster.getLayers().length).toBe(0);
});

it<Context>('should accept markers that are not circles', async ({
  markers,
  map,
}) => {
  map.setView([48.9, 2.3], 3);
  const cluster = new ClusterFeatureGroup([...markers, marker([0, 0])], {
    padding: 0,
  });
  cluster.addTo(map);

  await vi.waitFor(() => cluster.getLayers().length > 0);

  expect(cluster.getLayers().length).toBe(6);
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
