import { circleMarker, CircleMarker } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';
import { ClusterFeatureGroup } from '../lib/ClusterFeatureGroup';

interface Context {
  markers: CircleMarker[];
}

describe('ClusterFeatureGroup', () => {
  beforeEach<Context>((context) => {
    context.markers = [
      { id: 'frs', lat: 52, lng: 7 },
      { id: 'frr', lat: 54, lng: 8 },
      { id: 'frq', lat: -5, lng: 146 },
      { id: 'frp', lat: 45, lng: 6 },
      { id: 'frt', lat: -15, lng: 176 },
      { id: 'fry', lat: 55, lng: 5 },
    ].map((m) => circleMarker(m, { id: m.id } as any));
  });

  it<Context>('should accept CircleMarkers and create a CircleClusterMarker', ({
    markers,
  }) => {
    const cluster = new ClusterFeatureGroup(markers);
    expect(cluster.getLayers().length).greaterThan(0);
  });

  it<Context>('should use FSAC for creating clusters', ({ markers }) => {
    const cluster = new ClusterFeatureGroup(markers);
    expect(cluster.getLayers().length).toEqual(5);
  });
});
