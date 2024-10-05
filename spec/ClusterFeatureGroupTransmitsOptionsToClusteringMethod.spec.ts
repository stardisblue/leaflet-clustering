// @vitest-environment happy-dom

import { map } from 'leaflet';
import { expect, it } from 'vitest';

import { SupportedMarker } from '@/CircleClusterMarker';
import { ClusterFeatureGroup } from '@/ClusterFeatureGroup';
import { FsacClustering } from '@/clustering/FsacClustering';
import { ClusteringMethod, ClusterizeOptions } from '@/clustering/model';
import { NoClustering } from '@/clustering/NoClustering';

it('should use FsacClustering as the clustering method by default ', () => {
  const cluster = new ClusterFeatureGroup([]);

  expect(cluster.getClusteringMethod()).instanceOf(FsacClustering);
});

it('should be possible to personnalize the clustering method', () => {
  const cluster = new ClusterFeatureGroup([], { method: NoClustering });

  expect(cluster.getClusteringMethod()).instanceof(NoClustering);
});

class NoClusteringSpyOption implements ClusteringMethod {
  clusterizeOptions?: ClusterizeOptions;

  constructor(readonly constructorOptions: { a?: string; b?: string }) {}

  clusterize(
    items: SupportedMarker[],
    options: ClusterizeOptions
  ): SupportedMarker[] {
    this.clusterizeOptions = options;
    return items;
  }
}

it('should pass options to clustering method', () => {
  const clustererOptions = { a: 'this is an example', b: 'of options' };

  const cluster = new ClusterFeatureGroup([], {
    method: NoClusteringSpyOption,
    ...clustererOptions,
  });

  expect(cluster.getClusteringMethod().constructorOptions).toEqual(
    clustererOptions
  );
});

it('should pass project and unproject to the clusteringmethod during clustering', () => {
  const cluster = new ClusterFeatureGroup([], {
    method: NoClusteringSpyOption,
  });

  const leafletMap = map(document.createElement('div')).setView([48.9, 2.3], 3);
  leafletMap.addLayer(cluster);

  const options = cluster.getClusteringMethod().clusterizeOptions!;

  expect(options.project).toBeTypeOf('function');
  expect(options.unproject).toBeTypeOf('function');
});
