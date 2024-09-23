import { CircleMarker, LatLng, Marker, Point } from 'leaflet';
import { CircleClusterMarker } from '../CircleClusterMarker';

export type SupportedMarker = CircleMarker | Marker;

export interface Clustering {
  clusterize(
    items: SupportedMarker[],
    project: (latlng: LatLng) => Point,
    unproject: (point: { x: number; y: number }) => LatLng
  ): (CircleClusterMarker | SupportedMarker)[];
}
