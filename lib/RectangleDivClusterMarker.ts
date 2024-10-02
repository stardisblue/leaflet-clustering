import {
  divIcon,
  DivIconOptions,
  LatLng,
  Marker,
  MarkerOptions,
  Util,
} from 'leaflet';
import { SupportedMarker } from './CircleClusterMarker';
import { SquareCluster } from './clustering/Rectangle';

export type RectangleDivClusterMarkerOptions = Omit<MarkerOptions, 'icon'> & {
  icon?: (
    layers: SupportedMarker[],
    cluster: SquareCluster
  ) => Omit<DivIconOptions, 'icon' | 'iconSize' | 'iconAnchor'>;
};

export interface RectangleDivClusterMarker extends Marker {
  _layers: Record<number, SupportedMarker>;
  new (
    latLng: LatLng,
    layers: SupportedMarker[],
    cluster: SquareCluster,
    options?: RectangleDivClusterMarkerOptions
  ): RectangleDivClusterMarker;
  getLayers(): SupportedMarker[];
  getLayerId(layer: SupportedMarker): number;
}
export const RectangleDivClusterMarker: RectangleDivClusterMarker =
  Marker.extend({
    initialize(
      this: RectangleDivClusterMarker,
      latLng: LatLng,
      layers: SupportedMarker[],
      cluster: SquareCluster,
      { icon, ...options }: RectangleDivClusterMarkerOptions = {}
    ) {
      this._layers = Object.fromEntries(
        Array.from(layers, (l) => [this.getLayerId(l), l])
      );
      const iconOptions = icon
        ? icon(layers, cluster)
        : { html: '' + layers.length };

      (Marker.prototype as any).initialize.call(this, latLng, {
        icon: divIcon({
          ...iconOptions,
          iconSize: [cluster.maxX - cluster.minX, cluster.maxY - cluster.minY],
        }),
        ...options,
      });
    },

    getLayers(this: RectangleDivClusterMarker) {
      return Object.values(this._layers);
    },

    getLayerId(layer: SupportedMarker) {
      return Util.stamp(layer);
    },
  }) as any;
