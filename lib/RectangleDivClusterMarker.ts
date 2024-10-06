import {
  divIcon,
  DivIconOptions,
  LatLngExpression,
  Marker,
  MarkerOptions,
  Util,
} from 'leaflet';

import { SupportedMarker } from './CircleClusterMarker';
import { Rectangle, SquareCluster } from './shape/Rectangle';

export type RectangleDivClusterMarkerOptions<
  T extends Pick<Rectangle, 'maxX' | 'maxY' | 'minX' | 'minY'> = SquareCluster,
> = Omit<MarkerOptions, 'icon'> & {
  icon?: (
    layers: SupportedMarker[],
    cluster: T
  ) => Omit<DivIconOptions, 'icon' | 'iconSize' | 'iconAnchor'>;
};

interface RectangleDivClusterMarkerConstructor {
  new <
    T extends Pick<
      Rectangle,
      'maxX' | 'maxY' | 'minX' | 'minY'
    > = SquareCluster,
  >(
    latLng: LatLngExpression,
    layers: SupportedMarker[],
    cluster: T,
    options?: RectangleDivClusterMarkerOptions<T>
  ): RectangleDivClusterMarker;
}

export interface RectangleDivClusterMarker extends Marker {
  _layers: Record<number, SupportedMarker>;
  getLayers(): SupportedMarker[];
  getLayerId(layer: SupportedMarker): number;
}
export const RectangleDivClusterMarker: RectangleDivClusterMarkerConstructor =
  Marker.extend({
    initialize(
      this: RectangleDivClusterMarker,
      latLng: LatLngExpression,
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
