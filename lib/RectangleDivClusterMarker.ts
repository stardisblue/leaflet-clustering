import {
  Marker,
  LatLng,
  divIcon,
  Util,
  MarkerOptions,
  DivIconOptions,
} from 'leaflet';
import { SupportedMarker } from './CircleClusterMarker';
import { ClusterizableSquareCluster } from './clustering/ClusterizableRectangle';

export type RectangleDivClusterMarkerOptions = Omit<MarkerOptions, 'icon'> & {
  icon?: (
    layers: SupportedMarker[],
    clusterizable: ClusterizableSquareCluster
  ) => Omit<DivIconOptions, 'icon' | 'iconSize' | 'iconAnchor'>;
};

export interface RectangleDivClusterMarker extends Marker {
  _layers: Record<number, SupportedMarker>;
  new (
    latLng: LatLng,
    layers: SupportedMarker[],
    clusterizable: ClusterizableSquareCluster,
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
      clusterizable: ClusterizableSquareCluster,
      { icon, ...options }: RectangleDivClusterMarkerOptions = {}
    ) {
      this._layers = Object.fromEntries(
        Array.from(layers, (l) => [this.getLayerId(l), l])
      );
      const iconOptions = icon
        ? icon(layers, clusterizable)
        : { html: '' + layers.length };

      (Marker.prototype as any).initialize.call(this, latLng, {
        icon: divIcon({
          ...iconOptions,
          iconSize: [
            clusterizable.maxX - clusterizable.minX,
            clusterizable.maxY - clusterizable.minY,
          ],
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
