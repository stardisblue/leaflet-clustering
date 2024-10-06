// @vitest-environment happy-dom

import { circleMarker, Map, map, marker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { SpyNoClustering } from '@spec/lib/clustering/SpyNoClustering';

type Context = {
  map: Map;
  cluster: ClusterFeatureGroup<SpyNoClustering>;
  markers: SupportedMarker[];
};

beforeEach<Context>((context) => {
  context.markers = [circleMarker([0, 0]), marker([0, 0])];
  context.map = map(document.createElement('div'));
  context.cluster = new ClusterFeatureGroup(context.markers, {
    method: SpyNoClustering,
  });
});

describe('Apply clustering when map view is set', () => {
  it('should be empty when view is unset', ({ cluster, map }: Context) => {
    cluster.addTo(map);

    expect(cluster.getLayers()).toEqual([]);
  });

  it('should apply clustering when view is set', ({
    cluster,
    map,
    markers,
  }: Context) => {
    map.setView([48.9, 2.3], 3).addLayer(cluster);

    expect(cluster.getLayers()).toEqual(markers);
  });
});

it('should clear clusters when detaching from the map', ({
  cluster,
  map,
  markers,
}: Context) => {
  map.setView([48.9, 2.3], 3).addLayer(cluster);

  expect(cluster.getLayers()).toEqual(markers);

  map.removeLayer(cluster);

  expect(cluster.getLayers()).toEqual([]);
});

describe('Apply clustering when zooming on map', () => {
  beforeEach((context: Context) => {
    context.map.setView([48.9, 2.3], 3).addLayer(context.cluster);
  });

  it('should apply clustering when zooming', ({ cluster, map }: Context) => {
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(1);

    map.setZoom(2);
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(2);
  });

  it('should detach when removed from map', ({ cluster, map }: Context) => {
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(1);

    map.setZoom(2);
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(2);

    map.removeLayer(cluster).setZoom(3);
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(2);
  });
});

describe('Apply clustering when moving on map', () => {
  beforeEach<Context>((context) => {
    context.cluster = new ClusterFeatureGroup(context.markers, {
      method: SpyNoClustering,
      restrictToVisibleBounds: true,
    });
    context.map.setView([48.9, 2.3], 3).addLayer(context.cluster);
  });

  it('should apply clustering when moving', ({ cluster, map }: Context) => {
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(1);

    map.setView([48.9, 2.8]);
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(2);
  });

  it('should detach when removed from map', ({ cluster, map }: Context) => {
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(1);

    map.setView([11, 45]);
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(2);

    map.removeLayer(cluster).setView([12, 66]);
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(2);
  });
});
