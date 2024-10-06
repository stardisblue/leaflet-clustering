// @vitest-environment happy-dom

import { circleMarker, Map, map, marker } from 'leaflet';
import { beforeEach, expect, it } from 'vitest';

import { FsacClustering } from '@/clustering/FsacClustering';

type Context = {
  map: Map;
};

beforeEach<Context>((context) => {
  context.map = map(document.createElement('div')).setView([48.9, 2.3], 0);
});

it.for([
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
    map.setZoom(base);
    const fsac = new FsacClustering();

    const options = {
      project: map.project.bind(map),
      unproject: map.unproject.bind(map),
    };

    expect(fsac.clusterize(markers, options).length).toBe(2);
    map.setZoom(updated);
    expect(fsac.clusterize(markers, options).length).toBe(1);
  }
);
