import { FeatureGroup, LeafletEvent, Map } from 'leaflet';
import { CircleClusterMarker, SupportedMarker } from './CircleClusterMarker';
import {
  ClusterizableCircleCluster,
  ClusterizableCircleClusterOptions,
} from './clustering/ClusterizableCircle';
import {
  FsacClustering,
  FsacClusteringOptions,
} from './clustering/FsacClustering';
import { ClusterizablePair } from './clustering/model';

interface ClusterFeatureGroupCtor {
  new <
    O extends object = ClusterizableCircleClusterOptions,
    P extends ClusterizablePair = ClusterizableCircleCluster,
  >(
    clusters: SupportedMarker[],
    options?: FsacClusteringOptions<O, P>
  ): ClusterFeatureGroup<O, P>;
}

interface ClusterFeatureGroup<
  O extends object = ClusterizableCircleClusterOptions,
  P extends ClusterizablePair = ClusterizableCircleCluster,
> extends FeatureGroup {
  _clusterer: FsacClustering<O, P>;
  _markers: SupportedMarker[];
  _moveEnd(e: LeafletEvent): void;
  _zoomEnd(e: LeafletEvent): void;
  _zoom: number;
  getLayers(): CircleClusterMarker[];
  clusterize(): this;
}

export const ClusterFeatureGroup: ClusterFeatureGroupCtor = FeatureGroup.extend(
  {
    initialize(
      this: ClusterFeatureGroup,
      layers: SupportedMarker[],
      options: FsacClusteringOptions<
        Omit<ClusterizableCircleClusterOptions, 'padding'>,
        ClusterizableCircleCluster
      > = {}
    ) {
      this._markers = layers;
      this._clusterer = new FsacClustering(options);

      (FeatureGroup.prototype as any).initialize.call(this, [], options);
    },

    onAdd(this: ClusterFeatureGroup, map: Map) {
      FeatureGroup.prototype.onAdd.call(this, map);

      this._zoom = Math.floor(this._map.getZoom());

      this._map.on('zoomend', this._zoomEnd, this);
      this._map.on('moveend', this._moveEnd, this);
      this.clusterize();
    },

    onRemove(this: ClusterFeatureGroup, map: Map) {
      this._map.off('zoomend', this._zoomEnd, this);
      this._map.off('moveend', this._moveEnd, this);

      this.clearLayers();
      FeatureGroup.prototype.onRemove.call(this, map);
    },

    _zoomEnd(this: ClusterFeatureGroup, _e: LeafletEvent) {
      if (!this._map) {
        return;
      }

      this._zoom = Math.floor(this._map.getZoom());

      this.clusterize();
    },

    _moveEnd(this: ClusterFeatureGroup, _e: LeafletEvent) {},

    clusterize(this: ClusterFeatureGroup) {
      const layers = this._clusterer.clusterize(this._markers, {
        project: (latlng) => this._map.project(latlng, this._zoom),
        unproject: (point) => this._map.unproject(point as any, this._zoom),
      });

      this.clearLayers();
      layers.map((l) => this.addLayer(l));
    },
  }
) as any;
