import {
  CircleMarker,
  CircleMarkerOptions,
  LatLng,
  Marker,
  Util,
} from 'leaflet';

export type SupportedMarker = CircleMarker | Marker;

export type CircleClusterMarkerOptions = CircleMarkerOptions & {
  radius: number;
};

export interface CircleClusterMarker extends CircleMarker {
  _layers: Record<number, SupportedMarker>;
  new (
    latLng: LatLng,
    layers: SupportedMarker[],
    options: CircleClusterMarkerOptions
  ): CircleClusterMarker;
  getLayers(): SupportedMarker[];
  getLayerId(layer: SupportedMarker): number;
}

export const CircleClusterMarker: CircleClusterMarker = CircleMarker.extend({
  // #quickhull
  // #spiderfier
  // #bounds
  initialize(
    this: CircleClusterMarker,
    latLng: LatLng,
    layers: SupportedMarker[],
    { radius, ...options }: CircleClusterMarkerOptions
  ) {
    this._layers = Object.fromEntries(
      Array.from(layers, (l) => [this.getLayerId(l), l])
    );

    (CircleMarker.prototype as any).initialize.call(this, latLng, {
      radius,
      ...options,
    });
  },

  getLayers(this: CircleClusterMarker) {
    return Object.values(this._layers);
  },

  getLayerId(layer: CircleMarker) {
    return Util.stamp(layer);
  },
}) as any;
