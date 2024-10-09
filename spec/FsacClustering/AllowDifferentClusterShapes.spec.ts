import { circleMarker, Map, map, marker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { FsacClustering } from '@/clustering/FsacClustering';
import { RectangleDivClusterMarker } from '@/RectangleDivClusterMarker';
import { RoundDivClusterMarker } from '@/RoundDivClusterMarker';
import { SquareCluster } from '@/shape/Rectangle';

type Context = {
  map: Map;
};

beforeEach<Context>((context) => {
  context.map = map(document.createElement('div')).setView([48.9, 2.3], 5);
});

describe('Allow for different cluster shapes', () => {
  it('is CircleCluster by default', ({ map }: Context) => {
    const fsac = new FsacClustering({ ClusterMarker: RoundDivClusterMarker });

    const markers = [
      circleMarker([44.14155, 6.82979], { radius: 5 }),
      marker([44.0816, 7.90522]),
    ];

    const options = {
      project: map.project.bind(map),
      unproject: map.unproject.bind(map) as any,
    };

    expect(fsac.clusterize(markers, options)).toEqual(markers);
    map.setZoom(4);
    expect(fsac.clusterize(markers, options)).toMatchObject([
      new RoundDivClusterMarker(
        [44.111582601431465, 7.3675049999999995],
        markers,
        { radius: 10 + Math.sqrt(2) }
      ),
    ]);
  });

  it('allows to use SquareCluster', ({ map }: Context) => {
    const fsac = new FsacClustering({
      ShapedCluster: SquareCluster,
      ClusterMarker: RectangleDivClusterMarker,
    });

    const markers = [
      circleMarker([44.14155, 6.82979], { radius: 5 }),
      marker([44.0816, 7.90522]),
    ];

    const options = {
      project: map.project.bind(map),
      unproject: map.unproject.bind(map) as any,
    };
    expect(fsac.clusterize(markers, options)).toEqual(markers);
    map.setZoom(4);
    expect(fsac.clusterize(markers, options)).toMatchObject([
      new RectangleDivClusterMarker(
        [44.111582601431465, 7.3675049999999995],
        markers,
        { maxX: 22.828427124745758, maxY: 22.828427124746213, minX: 0, minY: 0 }
      ),
    ]);
  });
});
