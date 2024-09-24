import '../lib/style.css';

import { circleMarker, map, marker, tileLayer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ClusterFeatureGroup } from '../lib/ClusterFeatureGroup';
import glottolog from './dataset/glottolog.json';
import { RoundDivClusterMarker } from '../lib/RoundDivClusterMarker';

const leafletMap = map('map').setView([48.9, 2.3], 6);

tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(leafletMap);

const clusters = new ClusterFeatureGroup(
  glottolog.map((d) => (Math.random() > 0.5 ? circleMarker(d) : marker(d))),
  { ClusterMarker: RoundDivClusterMarker }
);

clusters
  .bindPopup(
    (d: any) =>
      d.getLatLng() +
      ' ' +
      (d.getRadius !== undefined && d.getRadius()) +
      ' ' +
      (d.getLayers !== undefined && d.getLayers()).length
  )
  .addTo(leafletMap);
