import { FeatureGroup, LeafletEvent, Map } from 'leaflet';
import { CircleClusterMarker, SupportedMarker } from './CircleClusterMarker';
import { FsacClustering } from './clustering/FsacClustering';
import { Clustering } from './clustering/model';

type ClusterMarkerGroupOptions = {
  method?: Clustering;
  padding?: number;
  baseRadius?: number;
};

interface ClusterFeatureGroup extends FeatureGroup {
  _clusterer: Clustering;
  _markers: SupportedMarker[];
  _moveEnd(e: LeafletEvent): void;
  _zoomEnd(e: LeafletEvent): void;
  _zoom: number;
  new (clusters: SupportedMarker[], options?: ClusterMarkerGroupOptions): this;
  getLayers(): CircleClusterMarker[];
  clusterize(): this;
}

export const ClusterFeatureGroup: ClusterFeatureGroup = FeatureGroup.extend({
  initialize(
    this: ClusterFeatureGroup,
    layers: SupportedMarker[],
    {
      method,
      padding = 4,
      baseRadius = 10,
      ...options
    }: ClusterMarkerGroupOptions = {}
  ) {
    this._markers = layers;
    this._clusterer =
      method ?? new FsacClustering({ padding, baseRadius: baseRadius });

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
    const layers = this._clusterer.clusterize(
      this._markers,
      (latlng) => this._map.project(latlng, this._zoom),
      (point) => this._map.unproject(point as any, this._zoom)
    );

    this.clearLayers();
    layers.map((l) => this.addLayer(l));
  },
}) as any;
