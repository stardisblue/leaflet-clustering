# Leaflet Clustering

[![npm version](https://img.shields.io/npm/v/leaflet-clustering.svg)](https://www.npmjs.com/package/leaflet-clustering)
[![build status](https://github.com/stardisblue/leaflet-clustering/actions/workflows/publish.yml/badge.svg)](https://github.com/stardisblue/leaflet-clustering/actions)
[![license](https://img.shields.io/github/license/stardisblue/leaflet-clustering)](LICENSE)

High performance clustering for leaflet.

![cluster map example](example/map.png)

## Features

- High-performance marker clustering for Leaflet
- Fine-grained control over clustering methods and marker appearance
- Restrict clustering to visible map bounds
- TypeScript support out of the box
- Easily extensible for custom clustering logic

If you want an out-of-the-box experience, go check out [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster).

If you want more fine-grained control on how clustering is done and mess around with markers, you're at the right place.

## Getting Started (npm)

To use leaflet-clustering in your project:

**Install via npm** :

```bash
npm install leaflet-clustering leaflet
```

**Import and use in your code**:

```typescript
import { ClusterFeatureGroup } from 'leaflet-clustering';
import { map, tileLayer, marker } from 'leaflet';

const leafletMap = map('map').setView([48.9, 2.3], 6);
tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(leafletMap);

const markers = [
  marker([48.8566, 2.3522]), // Paris
  marker([51.5074, -0.1278]) // London
];

const clusters = new ClusterFeatureGroup(markers, {
  restrictToVisibleBounds: true,
});
clusters.addTo(leafletMap);
```

**Bind popups or other interactions**:

```typescript
clusters.bindPopup((layer) => `Cluster contains ${layer.getLayers().length} markers`);
```

---

## Documentation & Examples

See [API section below](#api) for usage details.

> More examples and documentation coming soon!

---

## API

### ClusterFeatureGroup(_markers_, _options_)

The `ClusterFeatureGroup` is a class that extends Leaflet's `FeatureGroup` to provide clustering functionality for markers. It requires an array of markers and an optional configuration object.

**_markers_**: An array of `CircleMarker` or `Marker` instances that you want to cluster.

**_options_**: An optional object to configure the clustering behavior. It includes:

- **method**: A constructor for the clustering method to be used. Defaults to `FsacClustering`.
- **restrictToVisibleBounds**: A boolean indicating whether clustering should be restricted to markers within the current map view. Defaults to `false`.
- **FsacClustering**: Options specific to the default `FsacClustering` method, which are extracted from the `ClusterFeatureGroup` options. These include:
    - **padding**: A number specifying the padding to be used around clusters. Defaults to `4`.
    - **ShapedCluster**: A constructor for the shaped cluster to be used. Defaults to `CircleCluster`.
    - **shapedClusterOptions**: Options specific to the shaped cluster, excluding `padding`.
    - **ClusterMarker**: A constructor for the cluster marker to be used. Defaults to `CircleClusterMarker`.
    - **clusterMarkerOptions**: Options specific to the cluster marker.

The `ClusterFeatureGroup` provides several methods and properties to interact with the clustering:

- **getLayers()**: Returns the layers created by the clustering method.
- **getClusteringMethod()**: Returns the current clustering method instance.
- **clusterize()**: Triggers the clustering process for the current markers and map state.

## Wishlist

- [ ] allow any cluster marker to use convex hull
- [ ] allow any cluster marker to use spiderfier

### Future

- [ ] animate zoom transitions
- [ ] cache zoom levels
- [ ] allow to add and remove markers

## Contributing

To contribute or develop locally:

**Clone the repository**:
```bash
git clone https://github.com/stardisblue/leaflet-clustering.git
cd leaflet-clustering
```

**Install dependencies**:
```bash
npm install
```

**Run the development server**:
```bash
npm run dev
```

**Build the project**:
```bash
npm run build
```

**Run tests**:
```bash
npm test
```
