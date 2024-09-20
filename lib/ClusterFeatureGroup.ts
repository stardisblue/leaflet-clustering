import { CircleMarker, FeatureGroup, LeafletEvent, Map } from 'leaflet';
import { CircleClusterMarker } from './CircleClusterMarker';
import { ClusteringAlgorithm } from './ClusteringAlgorithm';
import { FsacClusteringAlgorithm } from './FsacClusteringAlgorithm';

type ClusterMarkerGroupOptions = { method?: ClusteringAlgorithm };

interface ClusterFeatureGroup extends FeatureGroup {
  _clusterer: ClusteringAlgorithm;
  _markers: CircleMarker[];
  _moveEnd(e: LeafletEvent): void;
  _zoomEnd(e: LeafletEvent): void;
  _zoom: number;
  new (clusters: CircleMarker[], options?: ClusterMarkerGroupOptions): this;
  getLayers(): CircleClusterMarker[];
  addLayer(layer: CircleMarker): this;
  removeLayer(layer: CircleMarker): this;
  clusterize(): this;
}

export const ClusterFeatureGroup: ClusterFeatureGroup = FeatureGroup.extend({
  initialize(
    this: ClusterFeatureGroup,
    layers: CircleMarker[],
    { method, ...options }: ClusterMarkerGroupOptions = {}
  ) {
    this._markers = layers;
    this._clusterer = method ?? new FsacClusteringAlgorithm();

    (FeatureGroup.prototype as any).initialize.call(this, [], options);
  },
  addLayer(this: ClusterFeatureGroup, layer: CircleMarker) {
    if (layer instanceof CircleClusterMarker) {
      // this is bad dealing with how FeatureGroup manages layers

      return FeatureGroup.prototype.addLayer.call(this, layer);
    }

    throw new Error('not implemented');
  },

  removeLayer(this: ClusterFeatureGroup, layer: CircleMarker) {
    if (layer instanceof CircleClusterMarker) {
      // this is bad dealing with how FeatureGroup manages layers

      return FeatureGroup.prototype.removeLayer.call(this, layer);
    }

    throw new Error('not implemented');
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
    console.log(this._zoom);
    console.log(this._map.getZoom());

    const layers = this._clusterer.clusterize(
      this._markers,
      (latlng) => this._map.project(latlng, this._zoom),
      (point) => this._map.unproject(point as any, this._zoom)
    );

    this.clearLayers();
    layers.map((l) => this.addLayer(l));
  },
}) as any;
