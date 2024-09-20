import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ClusterFeatureGroup } from '../lib/ClusterFeatureGroup';
import glottolog from './dataset/glottolog.json';

const map = L.map('map').setView([10.9, 2.3], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

new ClusterFeatureGroup(glottolog.map((d) => L.circleMarker(d, { radius: 1 })))
  .bindPopup((d: any) => d.getRadius() + ' ' + d.getLayers().length)
  .addTo(map);
