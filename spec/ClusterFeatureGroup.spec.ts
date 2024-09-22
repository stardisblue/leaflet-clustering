import { circleMarker, CircleMarker, Map, map } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';
import { ClusterFeatureGroup } from '../lib/ClusterFeatureGroup';

interface Context {
  markers: CircleMarker[];
  map: Map;
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
    ].map((m) => circleMarker(m));

    document.body.innerHTML = '<div id="map"></div>';
    context.map = map(document.getElementById('map') as any as HTMLElement);
  });

  it<Context>('should use FSAC for creating clusters', ({ markers, map }) => {
    map.setView([48.9, 2.3], 3);
    const cluster = new ClusterFeatureGroup(markers);
    cluster.addTo(map);

    setTimeout(() => {
      expect(cluster.getLayers().length).toEqual(4);
    }, 0);
  });

  it<Context>('should update clustering depending on zoomlevel', ({
    markers,
    map,
  }) => {
    map.setView([48.9, 2.3], 3);
    const cluster = new ClusterFeatureGroup(markers);
    cluster.addTo(map);

    setTimeout(() => {
      expect(cluster.getLayers().length).toEqual(4);
      map.setZoom(1);
      expect(cluster.getLayers().length).toEqual(3);
    }, 0);
  });

  it<Context>('should update clustering depending on radius', ({
    markers,
    map,
  }) => {
    map.setView([48.9, 2.3], 3);
    markers.forEach((m) => m.setRadius(30));
    const cluster = new ClusterFeatureGroup(markers);
    cluster.addTo(map);

    setTimeout(() => {
      expect(cluster.getLayers().length).toEqual(3);
    }, 0);
  });

});
