import { CircleMarker, LatLng, Util } from 'leaflet';

export type CircleMarkerClusterOptions = {
  radius: number;
  weight?: (marker: CircleMarker) => number;
};

export interface CircleClusterMarker extends CircleMarker {
  _layers: Record<number, CircleMarker>;
  _weight: (marker: CircleMarker) => number;
  new (
    latLng: LatLng,
    layers: CircleMarker[],
    options: CircleMarkerClusterOptions
  ): this;
  getLayers(): CircleMarker[];
  addLayers(layer: CircleMarker[]): this;
  addLayer(layer: CircleMarker): this;
  removeLayer(layer: CircleMarker): this;
  hasLayer(layer: CircleMarker): boolean;
  getLayerId(layer: CircleMarker): number;
  _computeLatLng(): LatLng;
  _computeRadius(): number;
}

export const CircleClusterMarker: CircleClusterMarker = CircleMarker.extend({
  // #quickhull
  // #spiderfier
  // #bounds
  initialize(
    this: CircleClusterMarker,
    latLng: LatLng,
    layers: CircleMarker[],
    {
      radius,
      weight = (m) => m.getRadius(),
      ...options
    }: CircleMarkerClusterOptions
  ) {
    this._layers = Object.fromEntries(
      Array.from(layers, (l) => [this.getLayerId(l), l])
    );
    this._weight = weight;

    (CircleMarker.prototype as any).initialize.call(this, latLng, {
      radius,
      ...options,
    });
  },

  getLayers(this: CircleClusterMarker) {
    return Object.values(this._layers);
  },

  // addLayers(this: CircleClusterMarker, layers: CircleMarker[]) {
  //   for (const layer of layers) {
  //     this._layers[this.getLayerId(layer)] = layer;
  //   }

  //   this.setRadius(this._computeRadius());
  //   this.setLatLng(this._computeLatLng());

  //   return this;
  // },

  // addLayer(this: CircleClusterMarker, layer: CircleMarker) {
  //   this._layers[this.getLayerId(layer)] = layer;

  //   this.setRadius(this._computeRadius());
  //   this.setLatLng(this._computeLatLng());

  //   return this;
  // },

  // removeLayer(this: CircleClusterMarker, layer: CircleMarker) {
  //   delete this._layers[this.getLayerId(layer)];

  //   this.setRadius(this._computeRadius());
  //   this.setLatLng(this._computeLatLng());

  //   return this;
  // },

  // hasLayer(this: CircleClusterMarker, layer: CircleMarker) {
  //   return this.getLayerId(layer) in this._layers;
  // },

  // _computeLatLng(this: CircleClusterMarker) {
  //   let weightedLat = 0;
  //   let weightedLng = 0;
  //   let totalWeight = 0;

  //   for (let i in this._layers) {
  //     if (this._layers.hasOwnProperty(i)) {
  //       const layer = this._layers[i];

  //       const latlng: LatLng = layer.getLatLng();
  //       const w = this._weight(layer);
  //       weightedLat += latlng.lat * w;
  //       weightedLng += latlng.lng * w;
  //       totalWeight += w;
  //     }
  //   }

  //   return new LatLng(weightedLat / totalWeight, weightedLng / totalWeight);
  // },

  // _computeRadius(this: CircleClusterMarker) {
  //   return Math.hypot(
  //     ...this.getLayers().map((l: CircleMarker) => l.getRadius())
  //   );
  // },

  getLayerId(layer: CircleMarker) {
    return Util.stamp(layer);
  },
}) as any;
