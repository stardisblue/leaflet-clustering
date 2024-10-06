// @vitest-environment happy-dom

import { RectangleDivClusterMarker } from '@/RectangleDivClusterMarker';
import { latLng, map } from 'leaflet';
import { describe, expect, it } from 'vitest';

const cluster = { minX: 10, minY: 10, maxX: 20, maxY: 20 };

describe('Is used the same way as Marker', () => {
  it('is possible to use map.addLayer(#)', () => {
    const marker = new RectangleDivClusterMarker([0, 0], [], cluster);
    const leafletMap = map(document.createElement('div')).addLayer(marker);

    expect(leafletMap.hasLayer(marker)).toBe(true);
  });

  it('is possible to use #.addTo(map)', () => {
    const leafletMap = map(document.createElement('div'));
    const marker = new RectangleDivClusterMarker([0, 0], [], cluster).addTo(
      leafletMap
    );

    expect(leafletMap.hasLayer(marker)).toBe(true);
  });

  it('takes Marker properties in account', () => {
    const optionsSubset = {
      opacity: 0.5,
      attribution: 'hello world',
    };
    const marker = new RectangleDivClusterMarker(
      [0, 0],
      [],
      cluster,
      optionsSubset
    );

    expect(marker.options).toMatchObject(optionsSubset);
  });
});

describe('Accepts various LatLng descriptions', () => {
  it('should accept [lat, lng] format', () => {
    const marker = new RectangleDivClusterMarker([5, 5], [], cluster);

    expect(marker.getLatLng()).toEqual(latLng(5, 5));
  });

  it('should accept L.latLng(lat, lng) format', () => {
    const marker = new RectangleDivClusterMarker(latLng(5, 5), [], cluster);

    expect(marker.getLatLng()).toEqual(latLng(5, 5));
  });
});
