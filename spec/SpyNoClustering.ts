import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusterizeOptions } from '@/clustering/model';
import { NoClustering } from '@/clustering/NoClustering';
import { Options } from '@/options';

export class SpyNoClustering implements NoClustering {
  readonly inhibitors?: (keyof Options)[];
  clusterizeOptions?: ClusterizeOptions;
  hasBeenCalled = 0;
  items?: SupportedMarker[];

  constructor(readonly constructorOptions: { inhibitors?: (keyof Options)[] }) {
    this.inhibitors = constructorOptions.inhibitors;
  }

  clusterize(
    items: SupportedMarker[],
    options: ClusterizeOptions
  ): SupportedMarker[] {
    this.clusterizeOptions = options;
    this.hasBeenCalled += 1;
    this.items = items;

    return items;
  }
}
