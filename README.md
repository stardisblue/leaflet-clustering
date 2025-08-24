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

## Getting Started

To use leaflet-clustering in your project:

### Peer Dependencies

- Requires [Leaflet](https://leafletjs.com/) as a peer dependency.
- Supported Leaflet versions: **v1.7.1 and above**

### Install via npm

```bash
npm install leaflet-clustering leaflet
```

### Import and use in your code

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

### Bind popups or other interactions

```typescript
clusters.bindPopup((layer) => `Cluster contains ${layer.getLayers().length} markers`);
```

---

## Documentation & Examples

See [API section below](#api) for usage details.

> More examples and documentation coming soon!

---

## API

### ClusterFeatureGroup(markers, options)

The `ClusterFeatureGroup` class extends Leaflet's `FeatureGroup` to provide clustering for markers. You only need to provide an array of markers and an optional configuration object.

- **markers**: Array of Leaflet marker instances to be clustered.
- **options**: Object to configure clustering behavior. Common options:
  - `restrictToVisibleBounds`: Restrict clustering to markers within the current map view (default: `false`).
  - `ClusterMarker`: Choose a marker style for clusters (e.g., `CircleClusterMarker`, `RoundDivClusterMarker`).
  - `ShapedCluster`: Choose a cluster shape (e.g., `CircleCluster`, `SquareCluster`).
  - `clusterMarkerOptions`: Options for customizing cluster marker appearance.
  - `shapedClusterOptions`: Options for customizing cluster shape.
  - `padding`: Padding around clusters in pixels (default: `4`).

See usage examples below for typical configurations.

---

### Advanced Options & Customization

For advanced users, you can further customize clustering behavior and marker appearance:

- **method**: Constructor for the clustering method. Default is `FsacClustering`. [Source](lib/clustering/FsacClustering.ts)
- **FsacClustering**: Options for the default clustering method:
  - `padding`: Padding around clusters in pixels (default: `4`).
  - `ShapedCluster`: Constructor for the shaped cluster. [CircleCluster](lib/shape/Circle.ts), [SquareCluster](lib/shape/Rectangle.ts)
  - `shapedClusterOptions`: Options for the shaped cluster, e.g., `baseRadius` for circles.
  - `ClusterMarker`: Constructor for the cluster marker. [CircleClusterMarker](lib/CircleClusterMarker.ts), [RoundDivClusterMarker](lib/RoundDivClusterMarker.ts), [RectangleDivClusterMarker](lib/RectangleDivClusterMarker.ts)
  - `clusterMarkerOptions`: Options for the cluster marker, e.g., `fillColor` or custom styles.

For more details, see:
- [`lib/clustering/FsacClustering.ts`](lib/clustering/FsacClustering.ts)
- [`lib/shape/Circle.ts`](lib/shape/Circle.ts)
- [`lib/shape/Rectangle.ts`](lib/shape/Rectangle.ts)
- [`lib/CircleClusterMarker.ts`](lib/CircleClusterMarker.ts)
- [`lib/RoundDivClusterMarker.ts`](lib/RoundDivClusterMarker.ts)
- [`lib/RectangleDivClusterMarker.ts`](lib/RectangleDivClusterMarker.ts)

## Available ShapedClusters
- `CircleCluster` (see `lib/shape/Circle.ts`)
- `SquareCluster` (see `lib/shape/Rectangle.ts`)

## Available ClusterMarkers
- `CircleClusterMarker` (see `lib/CircleClusterMarker.ts`)
- `RoundDivClusterMarker` (see `lib/RoundDivClusterMarker.ts`)
- `RectangleDivClusterMarker` (see `lib/RectangleDivClusterMarker.ts`)

### Compatibility Table
| ShapedCluster   | Compatible ClusterMarkers                |
|-----------------|------------------------------------------|
| CircleCluster   | CircleClusterMarker, RoundDivClusterMarker|
| SquareCluster   | RectangleDivClusterMarker                |

> **Note:** Using an incompatible combination will result in errors or unexpected behavior.

### Usage Examples

#### CircleCluster with CircleClusterMarker (default)
```typescript
const clusters = new ClusterFeatureGroup(markers, {
  // CircleCluster and CircleClusterMarker are default
});
```

#### CircleCluster with RoundDivClusterMarker
```typescript
const clusters = new ClusterFeatureGroup(markers, {
  ClusterMarker: RoundDivClusterMarker,
});
```

#### SquareCluster with RectangleDivClusterMarker
```typescript
import { ClusterFeatureGroup, SquareCluster, RectangleDivClusterMarker } from 'leaflet-clustering';

const clusters = new ClusterFeatureGroup(markers, {
  ShapedCluster: SquareCluster,
  ClusterMarker: RectangleDivClusterMarker,
});
```

#### Passing options
```typescript
const clusters = new ClusterFeatureGroup(markers, {
  clusterMarkerOptions: { fillColor: 'red' },
  shapedClusterOptions: { baseRadius: 20 },
});
```

---

## Wishlist

- [ ] allow any cluster marker to use convex hull
- [ ] allow any cluster marker to use spiderfier

### Future

- [ ] animate zoom transitions
- [ ] cache zoom levels
- [ ] allow to add and remove markers

---

## Contributing

To contribute or develop locally:

### Clone the repository
```bash
git clone https://github.com/stardisblue/leaflet-clustering.git
cd leaflet-clustering
```

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```

### Build the project
```bash
npm run build
```

### Run tests
```bash
npm test
```

---

## Credits

- Built on top of [Leaflet](https://leafletjs.com/).
- Inspired by [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster).
- Uses open-source libraries as listed in `package.json`.

---

## License

[![license](https://img.shields.io/github/license/stardisblue/leaflet-clustering)](LICENSE)

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
