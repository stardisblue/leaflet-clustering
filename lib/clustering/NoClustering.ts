import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusteringMethod, ClusterizeOptions } from '@/clustering/model';

export class NoClustering implements ClusteringMethod {
  clusterize(
    items: SupportedMarker[],
    _options: ClusterizeOptions
  ): SupportedMarker[] {
    return items;
  }
}
