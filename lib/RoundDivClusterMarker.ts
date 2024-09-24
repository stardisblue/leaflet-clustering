import {
  divIcon,
  DivIconOptions,
  LatLng,
  Marker,
  MarkerOptions,
  Util,
} from 'leaflet';
import { SupportedMarker } from './CircleClusterMarker';
import { ClusterizableCircleCluster } from './clustering/ClusterizableCircle';

export type RoundDivClusterMarkerOptions = Omit<MarkerOptions, 'icon'> & {
  icon?: (
    layers: SupportedMarker[],
    clusterizable: ClusterizableCircleCluster
  ) => Omit<DivIconOptions, 'icon' | 'iconSize' | 'iconAnchor'>;
};

export interface RoundDivClusterMarker extends Marker {
  _layers: Record<number, SupportedMarker>;
  new (
    latLng: LatLng,
    layers: SupportedMarker[],
    clusterizable: ClusterizableCircleCluster,
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
    clusterizable: ClusterizableCircleCluster,
    { icon, ...options }: RoundDivClusterMarkerOptions = {}
  ) {
    this._layers = Object.fromEntries(
      Array.from(layers, (l) => [this.getLayerId(l), l])
    );
    const iconOptions = icon
      ? icon(layers, clusterizable)
      : {
          html: '' + layers.length,
          className: 'leaflet-round-clustering-marker',
        };

    (Marker.prototype as any).initialize.call(this, latLng, {
      icon: divIcon({
        ...iconOptions,
        iconSize: [clusterizable.radius * 2, clusterizable.radius * 2],
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
