// @vitest-environment happy-dom

import { CircleClusterMarker } from '@/CircleClusterMarker';
import { latLng, map } from 'leaflet';
import { describe, expect, it } from 'vitest';

const cluster = { radius: 42 };

describe('Is used the same way as CircleMarker', () => {
  it('is possible to use map.addLayer(#)', () => {
    const marker = new CircleClusterMarker([0, 0], [], cluster);
    const leafletMap = map(document.createElement('div')).addLayer(marker);

    expect(leafletMap.hasLayer(marker)).toBe(true);
  });

  it('is possible to use #.addTo(map)', () => {
    const leafletMap = map(document.createElement('div'));
    const marker = new CircleClusterMarker([0, 0], [], cluster).addTo(
      leafletMap
    );

    expect(leafletMap.hasLayer(marker)).toBe(true);
  });

  it('takes circleMarker properties in account', () => {
    const marker = new CircleClusterMarker([0, 0], [], cluster, {
      fillColor: 'red',
      className: 'custom-classname',
    });

    expect(marker.options).toEqual({
      fillColor: 'red',
      className: 'custom-classname',
      ...cluster,
    });
  });
});

describe('Accepts various LatLng descriptions', () => {
  it('should accept [lat, lng] format', () => {
    const marker = new CircleClusterMarker([5, 5], [], cluster);

    expect(marker.getLatLng()).toEqual(latLng(5, 5));
  });

  it('should accept L.latLng(lat, lng) format', () => {
    const marker = new CircleClusterMarker(latLng(5, 5), [], cluster);

    expect(marker.getLatLng()).toEqual(latLng(5, 5));
  });
});
