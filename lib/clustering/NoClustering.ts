import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusteringMethod } from '@/clustering/model';

export class NoClustering implements ClusteringMethod {
  clusterize(items: SupportedMarker[]): SupportedMarker[] {
    return items;
  }
}
