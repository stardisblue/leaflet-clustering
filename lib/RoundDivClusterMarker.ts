import {
  divIcon,
  DivIconOptions,
  LatLngExpression,
  Marker,
  MarkerOptions,
  Util,
} from 'leaflet';

import { SupportedMarker } from './CircleClusterMarker';
import { CircleCluster } from './shape/Circle';

export type RoundDivClusterMarkerOptions<
  T extends Pick<CircleCluster, 'radius'> = CircleCluster,
> = Omit<MarkerOptions, 'icon'> & {
  icon?: (
    layers: SupportedMarker[],
    cluster: T
  ) => Omit<DivIconOptions, 'icon' | 'iconSize' | 'iconAnchor'>;
};

export interface RoundDivClusterMarkerConstructor {
  new <T extends Pick<CircleCluster, 'radius'> = CircleCluster>(
    latLng: LatLngExpression,
    layers: SupportedMarker[],
    cluster: T,
    options?: RoundDivClusterMarkerOptions<T>
  ): RoundDivClusterMarker;
}

export interface RoundDivClusterMarker extends Marker {
  _layers: Record<number, SupportedMarker>;
  getLayers(): SupportedMarker[];
  getLayerId(layer: SupportedMarker): number;
}

export const RoundDivClusterMarker: RoundDivClusterMarkerConstructor =
  Marker.extend({
    initialize(
      this: RoundDivClusterMarker,
      latLng: LatLngExpression,
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
