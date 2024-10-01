import { FeatureGroup, LeafletEvent, Map } from 'leaflet';
import { CircleClusterMarker, SupportedMarker } from './CircleClusterMarker';
import { FsacClustering } from './clustering/FsacClustering';
import { Clustering, ClusteringCtor } from './clustering/model';

type ClusterFeatureGroupOptions<Ctor extends ClusteringCtor<any, any>> = {
  method?: Ctor;
  restrictToVisibleBounds?: boolean;
} & (Ctor extends ClusteringCtor<any, infer O> ? O : {});

interface ClusterFeatureGroupCtor {
  new <Ctor extends ClusteringCtor<any, any> = typeof FsacClustering>(
    clusters: SupportedMarker[],
    options?: ClusterFeatureGroupOptions<Ctor>
  ): ClusterFeatureGroup<InstanceType<Ctor>>;
}

interface ClusterFeatureGroup<C extends Clustering<any> = FsacClustering>
  extends FeatureGroup {
  _restrictToVisibleBounds: boolean;
  _clusterer: C;
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
      this: ClusterFeatureGroup<FsacClustering>,
      layers: SupportedMarker[],
      {
        restrictToVisibleBounds = false,
        method = FsacClustering,
        ...options
      }: ClusterFeatureGroupOptions<typeof FsacClustering> = {}
    ) {
      this._restrictToVisibleBounds = restrictToVisibleBounds;
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
      if (this._restrictToVisibleBounds) this.clusterize();
    },

    clusterize(this: ClusterFeatureGroup) {
      let markers = this._markers;

      if (this._restrictToVisibleBounds) {
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
