import { LatLng, Point } from 'leaflet';

import { SupportedMarker } from '@/CircleClusterMarker';
import { Options } from '@/options';

export type ClusterizeOptions = {
  project: (layer: LatLng) => Point;
  unproject: (point: { x: number; y: number }) => LatLng;
};

export interface ClusteringMethod<M extends SupportedMarker = SupportedMarker> {
  readonly inhibitors?: (keyof Options)[];
  clusterize(items: SupportedMarker[], options: ClusterizeOptions): M[];
}

export type ClusteringMethodConstructor<
  C extends ClusteringMethod<any>,
  O = any,
> = new (options: O) => C;

export type ClusteringMethodOptions<C> = C extends new (options: infer O) => any
  ? O
  : never;
