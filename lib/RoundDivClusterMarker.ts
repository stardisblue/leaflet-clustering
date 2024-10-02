import {
  divIcon,
  DivIconOptions,
  LatLng,
  Marker,
  MarkerOptions,
  Util,
} from 'leaflet';
import { SupportedMarker } from './CircleClusterMarker';
import { CircleCluster } from './clustering/Circle';

export type RoundDivClusterMarkerOptions = Omit<MarkerOptions, 'icon'> & {
  icon?: (
    layers: SupportedMarker[],
    cluster: CircleCluster
  ) => Omit<DivIconOptions, 'icon' | 'iconSize' | 'iconAnchor'>;
};

export interface RoundDivClusterMarker extends Marker {
  _layers: Record<number, SupportedMarker>;
  new (
    latLng: LatLng,
    layers: SupportedMarker[],
    cluster: CircleCluster,
    options?: RoundDivClusterMarkerOptions
  ): RoundDivClusterMarker;
  getLayers(): SupportedMarker[];
  getLayerId(layer: SupportedMarker): number;
}

export const RoundDivClusterMarker: RoundDivClusterMarker = Marker.extend({
  initialize(
    this: RoundDivClusterMarker,
    latLng: LatLng,
    layers: SupportedMarker[],
    cluster: CircleCluster,
    { icon, ...options }: RoundDivClusterMarkerOptions = {}
  ) {
    this._layers = Object.fromEntries(
      Array.from(layers, (l) => [this.getLayerId(l), l])
    );
    const iconOptions = icon
      ? icon(layers, cluster)
      : {
          html: '' + layers.length,
          className: 'leaflet-round-clustering-marker',
        };

    (Marker.prototype as any).initialize.call(this, latLng, {
      icon: divIcon({
        ...iconOptions,
        iconSize: [cluster.radius * 2, cluster.radius * 2],
      }),
      ...options,
    });
  },

  getLayers(this: RoundDivClusterMarker) {
    return Object.values(this._layers);
  },

  getLayerId(layer: SupportedMarker) {
    return Util.stamp(layer);
  },
}) as any;
