// @vitest-environment happy-dom

import { circleMarker, Map, map, marker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { SpyNoClustering } from './SpyNoClustering';

type Context = {
  map: Map;
  markers: SupportedMarker[];
};

beforeEach<Context>((context) => {
  context.markers = [circleMarker([0, 0]), marker([10, 10])];
  context.map = map(document.createElement('div')).setView([1, 1], 10);
});

describe('Inhibit restrictToVisibleBounds with clustering method', () => {
  it('should not inhibit when no inhibitors are defined', ({
    markers,
    map,
  }: Context) => {
    const cluster = new ClusterFeatureGroup(markers, {
      method: SpyNoClustering,
      restrictToVisibleBounds: true,
    });
    map.addLayer(cluster);

    expect(cluster.getLayers()).toEqual([]);
  });

  it('should inhibit when defined', ({ markers, map }: Context) => {
    const cluster = new ClusterFeatureGroup(markers, {
      method: SpyNoClustering,
      restrictToVisibleBounds: true,
      inhibitors: ['restrictToVisibleBounds'],
    });

    map.addLayer(cluster);
    expect(cluster.getLayers()).toEqual(markers);
  });

  it('should inhibit when moveend', ({ markers, map }: Context) => {
    const cluster = new ClusterFeatureGroup(markers, {
      method: SpyNoClustering,
      restrictToVisibleBounds: true,
      inhibitors: ['restrictToVisibleBounds'],
    });

    map.addLayer(cluster);
    expect(cluster.getLayers()).toEqual(markers);

    map.setView([8, 8]);
    expect(cluster.getLayers()).toEqual(markers);
  });

  it('should inhibit when zoomend', ({ markers, map }: Context) => {
    const cluster = new ClusterFeatureGroup(markers, {
      method: SpyNoClustering,
      restrictToVisibleBounds: true,
      inhibitors: ['restrictToVisibleBounds'],
    });

    map.addLayer(cluster);
    expect(cluster.getLayers()).toEqual(markers);

    map.setZoom(12);
    expect(cluster.getLayers()).toEqual(markers);
  });

  it('should be passed to ClusteringMethod when inhibited', ({
    markers,
  }: Context) => {
    const cluster = new ClusterFeatureGroup(markers, {
      method: SpyNoClustering,
      restrictToVisibleBounds: true,
      inhibitors: ['restrictToVisibleBounds'],
    });

    expect(cluster.getClusteringMethod().constructorOptions).toEqual({
      restrictToVisibleBounds: true,
      inhibitors: ['restrictToVisibleBounds'],
    });
  });
});
