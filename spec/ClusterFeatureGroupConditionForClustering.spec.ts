import { circleMarker, map, marker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { NoClustering } from '@/clustering/NoClustering';

let leafletMap: ReturnType<typeof map>;
let cluster: InstanceType<typeof ClusterFeatureGroup>;
let markers: SupportedMarker[];

beforeEach(() => {
  markers = [circleMarker([0, 0]), marker([0, 0])];
  leafletMap = map(document.createElement('div'));
  cluster = new ClusterFeatureGroup(markers, { method: NoClustering });
});

describe('Apply clustering when map view is set', () => {
  it('should be empty when view is unset', () => {
    cluster.addTo(leafletMap);

    expect(cluster.getLayers()).toEqual([]);
  });

  it('should apply clustering when view is set', () => {
    leafletMap.setView([48.9, 2.3], 3).addLayer(cluster);

    expect(cluster.getLayers()).toEqual(markers);
  });
});

it('should clear clusters when detaching from the map', () => {
  leafletMap.setView([48.9, 2.3], 3).addLayer(cluster);

  expect(cluster.getLayers()).toEqual(markers);

  leafletMap.removeLayer(cluster);

  expect(cluster.getLayers()).toEqual([]);
});

class SpyNoClustering extends NoClustering {
  hasBeenCalled = 0;
  clusterize(items: SupportedMarker[]): SupportedMarker[] {
    this.hasBeenCalled += 1;
    return super.clusterize(items);
  }
}

describe('Apply clustering when zooming on map', () => {
  beforeEach(() => {
    cluster = new ClusterFeatureGroup(markers, { method: SpyNoClustering });
    leafletMap.setView([48.9, 2.3], 3).addLayer(cluster);
  });

  it('should apply clustering when zooming', () => {
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(1);

    leafletMap.setZoom(2);
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(2);
  });

  it('should detach when removed from map', () => {
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(1);

    leafletMap.setZoom(2);
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(2);

    leafletMap.removeLayer(cluster).setZoom(3);
    expect(cluster.getClusteringMethod().hasBeenCalled).toBe(2);
  });
});
