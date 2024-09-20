import { CircleMarker, FeatureGroup, Util } from 'leaflet';

class ClusteringAlgorithm {}

// Marker.include({
//   /** this should ideally be defined inside ClusteringAlgorithm */
//   toBBox() {
//     const point: Point = this._map.project(this.getLatLng());
//     return {
//       minX: point.x - 10,
//       maxX: point.x + 10,
//       minY: point.y - 10,
//       maxY: point.y + 10,
//     };
//   },
// });

type ClusterMarkerGroupOptions = {
  method: ClusteringAlgorithm;
};

// we can bypass most of boulding detection by adding custom methods to popular marker i think ...

export class ClusterMarkerGroup extends FeatureGroup {
  constructor(layers: CircleMarker[], options?: ClusterMarkerGroupOptions) {
    super(layers);
    Util.setOptions(this, options);
  }

  onAdd(map: L.Map) {
    debugger;
    super.onAdd(map);

    return this;
  }
  // onRemove(map: L.Map) {
  //   super.onRemove(map);
  //   return this;
  // }
}

// export const ClusterMarkerGroup = FeatureGroup.extend({
//   initialize(layers: CircleMarker[], options: ClusterMarkerGroupOptions) {
//     FeatureGroup.prototype.initialize.call(this, layers);
//   },
//   // layers need to be pre-declared (no addLayer / addLayers method yet)
//   // update clusters on zoom using method
//   // each layer need to declare it's pixel dimensions
//   // this._map.project(layer.getLatLng(), zoom);
//   // update ClusterMarker for each cluster
//   // method contains the clustering algorithm,
//   // - the way to compute bounds of a cluster getBounds() mostly ?
//   // - the way to compute bounds of an item
//   // try to find a method to do the animation...
//   // compute movement from previous to current clusters ?
//   // beforeAdd(map: L.Map) {},
//   onAdd(map: L.Map) {
//     FeatureGroup.prototype.onAdd.call(this, map);
//   },
//   // onRemove(map: L.Map) {},
//   // getEvents() {},
//   getAttribution() {},
// });

/**
 * Spec :
 *
 * [x] Je veux représenter les Cluster comme des cercles
 * [x] Je veux créer un cluster en forme de cercle dans leaflet contenant tous les élements
 * [x] Je veux utiliser CircleMarker sans avoir a redéfinir quoi que ce soit.
 * [x] Je veux créer un layer contenant tous les cluster dans leaflet
 * [x] Je veux ajouter les cluster en tant que groupe a leaflet
 * Je veux utiliser FSAC pour clusteriser les markers
 * Je veux que l'algorithme soit exécuté dés que je zoom
 * Je veux modifier la facon dont les cluster sont représentés
 * Je veux accéder au contenu des clusters
 *
 * je veux avoir des padding entre les clusters et pouvoir les changer
 * Je veux définir l'algorithme de création des clusters
 * Je ne veux pas avoir a gérer les positions gps dans l'algorithme
 * Je veux restreindre le clustering à la fenêtre actuelle
 * Je veux utiliser Marker sans avoir a redéfinir quoi que ce soit.
 * Je veux utiliser d'autres types de Layers que les Markers
 *
 *
 *
 * Optionnel:
 * Je veux animer lors des zoom et dézoom
 * je veux
 *
 */
