// @vitest-environment happy-dom

import { circleMarker, map, Map } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { FsacClustering } from '@/clustering/FsacClustering';
import { CircleClusterMarker } from '@/CircleClusterMarker';
import { RoundDivClusterMarker } from '@/RoundDivClusterMarker';
import { RectangleDivClusterMarker } from '@/RectangleDivClusterMarker';
import { SquareCluster } from '@/shape/Rectangle';

type Context = {
  map: Map;
};

beforeEach<Context>((context) => {
  context.map = map(document.createElement('div')).setView([48.9, 2.3], 4);
});

describe('ClusterMarker can be customized', () => {
  it('uses CircleClusterMarker by default', ({ map }: Context) => {
    const markers = [
      circleMarker([44.14155, 6.82979], { radius: 5 }),
      circleMarker([44.0816, 7.90522], { radius: 5 }),
    ];

    const clusterLayer = new ClusterFeatureGroup(markers, {
      method: FsacClustering,
    });

    map.addLayer(clusterLayer);

    expect(clusterLayer.getLayers()).toMatchObject([
      new CircleClusterMarker(
        [44.111582601431465, 7.3675049999999995],
        markers,
        { radius: 10 + Math.sqrt(2) }
      ),
    ]);
  });

  it('allows RoundDivClusterMarker to be used', ({ map }: Context) => {
    const markers = [
      circleMarker([44.14155, 6.82979], { radius: 5 }),
      circleMarker([44.0816, 7.90522], { radius: 5 }),
    ];

    const clusterLayer = new ClusterFeatureGroup(markers, {
      ClusterMarker: RoundDivClusterMarker,
    });

    map.addLayer(clusterLayer);

    expect(clusterLayer.getLayers()).toMatchObject([
      new RoundDivClusterMarker(
        [44.111582601431465, 7.3675049999999995],
        markers,
        { radius: 10 + Math.sqrt(2) }
      ),
    ]);
  });

  it('allows RectangleDivClusterMarker to be used as long as ShapedCluster is defined properly ', ({
    map,
  }: Context) => {
    const markers = [
      circleMarker([44.14155, 6.82979], { radius: 5 }),
      circleMarker([44.0816, 7.90522], { radius: 5 }),
    ];

    const clusterLayer = new ClusterFeatureGroup(markers, {
      ShapedCluster: SquareCluster,
      ClusterMarker: RectangleDivClusterMarker,
    });

    map.addLayer(clusterLayer);

    expect(clusterLayer.getLayers()).toMatchObject([
      new RectangleDivClusterMarker(
        [44.111582601431465, 7.3675049999999995],
        markers,
        { maxX: 22.828427124745758, maxY: 22.828427124746213, minX: 0, minY: 0 }
      ),
    ]);
  });

  it('passes ClusterMarker options to respective object', ({
    map,
  }: Context) => {
    const markers = [
      circleMarker([44.14155, 6.82979], { radius: 5 }),
      circleMarker([44.0816, 7.90522], { radius: 5 }),
    ];

    const options = { fillColor: 'red', attribution: 'hello world' };
    const clusterLayer = new ClusterFeatureGroup(markers, {
      clusterMarkerOptions: options,
    });

    map.addLayer(clusterLayer);

    expect(clusterLayer.getLayers()).toMatchObject([
      new CircleClusterMarker(
        [44.111582601431465, 7.3675049999999995],
        markers,
        { radius: 10 + Math.sqrt(2) },
        options
      ),
    ]);
  });

  it('passes ShapedCluster options to respective object', ({
    map,
  }: Context) => {
    const markers = [
      circleMarker([44.14155, 6.82979], { radius: 5 }),
      circleMarker([44.0816, 7.90522], { radius: 5 }),
    ];

    const options = { baseRadius: 20 };
    const clusterLayer = new ClusterFeatureGroup(markers, {
      shapedClusterOptions: options,
    });

    map.addLayer(clusterLayer);

    expect(clusterLayer.getLayers()).toMatchObject([
      new CircleClusterMarker(
        [44.111582601431465, 7.3675049999999995],
        markers,
        { radius: 20 + Math.sqrt(2) }
      ),
    ]);
  });
});
