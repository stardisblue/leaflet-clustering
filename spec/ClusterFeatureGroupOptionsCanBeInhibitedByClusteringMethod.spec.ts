// @vitest-environment happy-dom

import { circleMarker, map, marker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { NoClustering } from '@/clustering/NoClustering';

class NoClusteringWithInhibitor extends NoClustering {
  inhibitors = ['restrictToVisibleBounds'];
  items: SupportedMarker[] = [];

  clusterize(items: SupportedMarker[]): SupportedMarker[] {
    this.items = items;
    return super.clusterize(items);
  }
}

let leafletMap: ReturnType<typeof map>;
let cluster: ClusterFeatureGroup<NoClustering>;
let markers: SupportedMarker[];

beforeEach(() => {
  markers = [circleMarker([0, 0]), marker([10, 10])];
  leafletMap = map(document.createElement('div')).setView([1, 1], 10);
});

describe('Inhibit restrictToVisibleBounds with clustering method', () => {
  it('should not inhibit when no inhibitors are defined', () => {
    cluster = new ClusterFeatureGroup(markers, {
      method: NoClustering,
      restrictToVisibleBounds: true,
    });
    leafletMap.addLayer(cluster);

    expect(cluster.getLayers()).toEqual([]);
  });

  it('should inhibit when defined', () => {
    cluster = new ClusterFeatureGroup(markers, {
      method: NoClusteringWithInhibitor,
      restrictToVisibleBounds: true,
    });

    leafletMap.addLayer(cluster);
    expect(cluster.getLayers()).toEqual(markers);
  });

  it('should inhibit when moveend', () => {
    cluster = new ClusterFeatureGroup(markers, {
      method: NoClusteringWithInhibitor,
      restrictToVisibleBounds: true,
    });

    leafletMap.addLayer(cluster);
    expect(cluster.getLayers()).toEqual(markers);

    leafletMap.setView([8, 8]);
    expect(cluster.getLayers()).toEqual(markers);
  });

  it('should inhibit when zoomend', () => {
    cluster = new ClusterFeatureGroup(markers, {
      method: NoClusteringWithInhibitor,
      restrictToVisibleBounds: true,
    });

    leafletMap.addLayer(cluster);
    expect(cluster.getLayers()).toEqual(markers);

    leafletMap.setZoom(12);
    expect(cluster.getLayers()).toEqual(markers);
  });
});
