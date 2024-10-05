import { circleMarker, map, marker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { NoClustering } from '@/clustering/NoClustering';

describe('Cluster visible markers only', () => {
  let leafletMap: ReturnType<typeof map>;
  let markers: SupportedMarker[];

  beforeEach(() => {
    markers = [circleMarker([0, 0]), marker([50, 50])];
    leafletMap = map(document.createElement('div')).setView([0, 0], 10);
  });

  it('should behave like before by default', () => {
    const cluster = new ClusterFeatureGroup(markers, { method: NoClustering });
    leafletMap.addLayer(cluster);

    expect(cluster.getLayers()).toEqual(markers);
  });

  it('should restrict to markers in bounds', () => {
    const cluster = new ClusterFeatureGroup(markers, {
      method: NoClustering,
      restrictToVisibleBounds: true,
    });

    leafletMap.addLayer(cluster);

    expect(cluster.getLayers()).toEqual([markers[0]]);
  });
});
