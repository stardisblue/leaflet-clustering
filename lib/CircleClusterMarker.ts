import {
  CircleMarker,
  CircleMarkerOptions,
  LatLng,
  Marker,
  Util,
} from 'leaflet';
import { Circle } from './clustering/Circle';

export type SupportedMarker = CircleMarker | Marker;

export type CircleClusterMarkerOptions = Omit<CircleMarkerOptions, 'radius'>;

export interface CircleClusterMarker extends CircleMarker {
  _layers: Record<number, SupportedMarker>;
  new (
    latLng: LatLng,
    layers: SupportedMarker[],
    cluster: Pick<Circle, 'radius'>,
    options?: CircleClusterMarkerOptions
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
    { radius }: Pick<Circle, 'radius'>,
    options: CircleClusterMarkerOptions = {}
  ) {
    this._layers = Object.fromEntries(
      Array.from(layers, (l) => [this.getLayerId(l), l])
    );

    (CircleMarker.prototype as any).initialize.call(this, latLng, {
      ...options,
      radius,
    });
  },

  getLayers(this: CircleClusterMarker) {
    return Object.values(this._layers);
  },

  getLayerId(layer: SupportedMarker) {
    return Util.stamp(layer);
  },
}) as any;
