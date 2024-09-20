import { Window } from 'happy-dom';
import { CircleMarker, circleMarker, map } from 'leaflet';
import { beforeEach, describe, expect, it } from 'vitest';

import { CircleClusterMarker } from '../lib/CircleClusterMarker';

/**I want to create a cluster that is a circle containing all the markers in leaflet */
describe('Leaflet circle marker representing a cluster', () => {
  let markers: CircleMarker[] = [];
  let cluster: CircleClusterMarker;
  beforeEach(() => {
    markers = [
      { id: 'frs', lat: 52, lng: 7 },
      { id: 'frr', lat: 54, lng: 8 },
      { id: 'frq', lat: -5, lng: 146 },
      { id: 'frp', lat: 45, lng: 6 },
      { id: 'frt', lat: -15, lng: 176 },
      { id: 'fry', lat: 55, lng: 5 },
    ].map((m) => circleMarker(m, { id: m.id } as any));

    cluster = new CircleClusterMarker(markers);
  });

  it('should have accept multiple CircleMarkers', () => {
    expect(cluster.getLayers()).toStrictEqual(markers);
  });

  it('should be positionned at the centroid of the markers', () => {
    expect(cluster.getLatLng()).toEqual({ lat: 31, lng: 58 });
  });

  it('the area should be the sum of all the markers area', () => {
    expect(cluster.getRadius()).toStrictEqual(Math.sqrt(600));
  });

  it('the centroid depends on the weight of the clusters', () => {
    cluster = new CircleClusterMarker(markers, {
      weight: (m) => ((m.options as any).id === 'frs' ? 30 : m.getRadius()),
    });

    expect(cluster.getLatLng()).toStrictEqual({ lat: 36.25, lng: 45.25 });
  });

  it('should behave like a classical CircleMarker', () => {
    const document = new Window({ url: 'https://localhost:8080' }).document;
    document.body.innerHTML = '<div id="map"></div>';

    const leafletMap = map(
      document.getElementById('map') as any as HTMLElement
    );

    cluster.addTo(leafletMap);

    expect(leafletMap.hasLayer(cluster)).toBe(true);
  });

  describe('adding a circleMarker', () => {
    let added: CircleMarker;

    beforeEach(() => {
      added = circleMarker([48, 24], { radius: 25 });
      cluster.addLayer(added);
    });

    it('should be possible to add markers to it', () => {
      expect(cluster.getLayers()).toStrictEqual([...markers, added]);
    });

    it('should correctly update the radius', () => {
      expect(cluster.getRadius()).toBe(35);
    });

    it('should correctly update the position', () => {
      expect(cluster.getLatLng()).toStrictEqual({ lat: 36, lng: 48 });
    });
  });

  describe('removing a circleMarker', () => {
    let added: CircleMarker;

    beforeEach(() => {
      added = circleMarker([48, 24], { radius: 25 });
      cluster.addLayer(added);
      cluster.removeLayer(added);
    });

    it('should be possible to add markers to it', () => {
      expect(cluster.getLayers()).toStrictEqual(markers);
    });

    it('should correctly update the radius', () => {
      expect(cluster.getRadius()).toStrictEqual(Math.sqrt(600));
    });

    it('should correctly update the position', () => {
      expect(cluster.getLatLng()).toStrictEqual({ lat: 31, lng: 58 });
    });
  });
});
