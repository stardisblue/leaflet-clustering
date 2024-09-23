// layers need to be pre-declared (no addLayer / addLayers method yet)
// update clusters on zoom using method
// each layer need to declare it's pixel dimensions
// this._map.project(layer.getLatLng(), zoom);
// update ClusterMarker for each cluster
// method contains the clustering algorithm,
// - the way to compute bounds of a cluster getBounds() mostly ?
// - the way to compute bounds of an item
// try to find a method to do the animation...
// compute movement from previous to current clusters ?

/**
 * Spec :
 *
 * [x] Je veux représenter les Cluster comme des cercles
 * [x] Je veux créer un cluster en forme de cercle dans leaflet contenant tous les élements
 * [x] Je veux utiliser CircleMarker sans avoir a redéfinir quoi que ce soit.
 * [x] Je veux créer un layer contenant tous les cluster dans leaflet
 * [x] Je veux ajouter les cluster en tant que groupe a leaflet
 * [x] Je veux utiliser FSAC pour clusteriser les markers
 * [x] Je veux que l'algorithme soit exécuté dés que je zoom
 * [x] Je veux accéder au contenu des clusters
 * Je veux modifier la facon dont les cluster sont représentés
 *
 * [x] je veux avoir des padding entre les clusters et pouvoir les changer
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
