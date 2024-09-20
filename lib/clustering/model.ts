import { CircleMarker, LatLng, Point } from 'leaflet';
import { CircleClusterMarker } from '../CircleClusterMarker';

export interface ClusteringAlgorithm {
  clusterize(
    items: CircleMarker[],
    project: (latlng: LatLng) => Point,
    unproject: (point: { x: number; y: number }) => LatLng
  ): CircleClusterMarker[];
}
