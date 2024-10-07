import { RoundDivClusterMarker } from '@/RoundDivClusterMarker';
import { latLng, map } from 'leaflet';
import { describe, expect, it } from 'vitest';

const cluster = { radius: 42 };

describe('Is used the same way as Marker', () => {
  it('can be added with map.addLayer(#)', () => {
    const marker = new RoundDivClusterMarker([0, 0], [], cluster);
    const leafletMap = map(document.createElement('div')).addLayer(marker);

    expect(leafletMap.hasLayer(marker)).toBe(true);
  });

  it('can be added with #.addTo(map)', () => {
    const leafletMap = map(document.createElement('div'));
    const marker = new RoundDivClusterMarker([0, 0], [], cluster).addTo(
      leafletMap
    );

    expect(leafletMap.hasLayer(marker)).toBe(true);
  });

  it('takes Marker properties in account', () => {
    const optionsSubset = {
      opacity: 0.5,
      attribution: 'hello world',
    };
    const marker = new RoundDivClusterMarker(
      [0, 0],
      [],
      cluster,
      optionsSubset
    );

    expect(marker.options).toMatchObject(optionsSubset);
  });
});

describe('Accepts various LatLng descriptions', () => {
  it('accepts [lat, lng] format', () => {
    const marker = new RoundDivClusterMarker([5, 5], [], cluster);

    expect(marker.getLatLng()).toEqual(latLng(5, 5));
  });

  it('accepts L.latLng(lat, lng) format', () => {
    const marker = new RoundDivClusterMarker(latLng(5, 5), [], cluster);

    expect(marker.getLatLng()).toEqual(latLng(5, 5));
  });
});

it('accepts Icon options', () => {
  const marker = new RoundDivClusterMarker(latLng(5, 5), [], cluster, {
    icon() {
      return { className: 'custom-classname', attribution: 'hello world' };
    },
  });

  expect(marker.getIcon().options).toMatchObject({
    className: 'custom-classname',
    attribution: 'hello world',
  });
});
