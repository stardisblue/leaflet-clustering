// @vitest-environment happy-dom

import { circleMarker, latLng, map } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { CircleClusterMarker } from '@/CircleClusterMarker';

type CustomContext = { map: L.Map; markers: L.CircleMarker[] };

/**I want to create a cluster that is a circle containing all the markers in leaflet */
describe('Leaflet circle marker representing a cluster', () => {
  beforeEach<CustomContext>((context) => {
    context.markers = [
      { id: 'frs', lat: 52, lng: 7 },
      { id: 'frr', lat: 54, lng: 8 },
      { id: 'frq', lat: -5, lng: 146 },
      { id: 'frp', lat: 45, lng: 6 },
      { id: 'frt', lat: -15, lng: 176 },
      { id: 'fry', lat: 55, lng: 5 },
    ].map((m) => circleMarker(m, { id: m.id } as any));
    document.body.innerHTML = '<div id="map"></div>';

    context.map = map(document.getElementById('map') as any as HTMLElement);
  });

  it<CustomContext>('should behave like a classical CircleMarker', ({
    map,
    markers,
  }) => {
    const cluster = new CircleClusterMarker(latLng(0, 0), markers, {
      radius: 10,
    });

    cluster.addTo(map);
    expect(map.hasLayer(cluster)).toBe(true);
  });
});
