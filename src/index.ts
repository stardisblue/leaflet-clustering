import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ClusterFeatureGroup } from '../lib/ClusterFeatureGroup';
import glottolog from './dataset/glottolog.json';

const map = L.map('map').setView([49, 2.3], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

new ClusterFeatureGroup(
  [
    { id: 'frs', lat: 49.1, lng: 2.3 },
    { id: 'frr', lat: 49, lng: 2.3 },
    { id: 'frq', lat: 48.9, lng: 2.3 },
    { id: 'frp', lat: 48.95, lng: 2.3 },
    { id: 'frt', lat: 49.05, lng: 2.3 },
    { id: 'fry', lat: 49, lng: 2.31 },
  ].map((d) => L.circleMarker(d))
)
  .bindPopup((d: any) => d.getRadius() + ' ' + d.getLayers().length)
  .addTo(map);
