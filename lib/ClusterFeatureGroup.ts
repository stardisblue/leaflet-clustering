import { FeatureGroup, LeafletEvent, Map } from 'leaflet';
import { CircleClusterMarker, SupportedMarker } from './CircleClusterMarker';
import { FsacClustering } from './clustering/FsacClustering';
import {
  ClusteringMethod,
  ClusteringMethodCtor,
  ClusteringMethodOptions,
} from './clustering/model';
import { Options } from './options';

type ClusterFeatureGroupMethodOptions<C extends ClusteringMethodCtor<any>> = {
  method?: C;
} & ClusteringMethodOptions<C>;

type ClusterFeatureGroupOptions<C extends ClusteringMethodCtor<any>> = Options &
  ClusterFeatureGroupMethodOptions<C>;

interface ClusterFeatureGroupCtor {
  new <C extends ClusteringMethodCtor<any> = typeof FsacClustering>(
    clusters: SupportedMarker[],
    options?: ClusterFeatureGroupOptions<C>
  ): ClusterFeatureGroup<InstanceType<C>>;
}

interface ClusterFeatureGroup<
  C extends ClusteringMethod<any> = ClusteringMethod<any>,
> extends FeatureGroup {
  _clusterer: C;
  _restrictToVisibleBounds: boolean;
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
      {
        method = FsacClustering,
        ...options
      }: ClusterFeatureGroupOptions<typeof FsacClustering> = {}
    ) {
      this._restrictToVisibleBounds = options.restrictToVisibleBounds ?? false;
      this._markers = layers;
      this._clusterer = new method(options);

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

    _moveEnd(this: ClusterFeatureGroup, _e: LeafletEvent) {
      if (
        this._restrictToVisibleBounds &&
        !this._clusterer?.inhibitors?.includes('restrictToVisibleBounds')
      )
        this.clusterize();
    },

    clusterize(this: ClusterFeatureGroup) {
      let markers = this._markers;

      if (
        this._restrictToVisibleBounds &&
        !this._clusterer?.inhibitors?.includes('restrictToVisibleBounds')
      ) {
        const bounds = this._map.getBounds().pad(1);

        markers = this._markers.filter((marker) =>
          bounds.contains(marker.getLatLng())
        );
      }

      const layers = this._clusterer.clusterize(markers, {
        project: (latlng) => this._map.project(latlng, this._zoom),
        unproject: (point) => this._map.unproject(point as any, this._zoom),
      });

      this.clearLayers();
      layers.map((l) => this.addLayer(l));
    },
  }
) as any;
