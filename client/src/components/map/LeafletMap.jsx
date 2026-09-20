import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons (they normally load from a CDN path that breaks
// under bundlers). We point them at the leaflet package assets via Vite's URL
// imports so markers render reliably.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * markers: [{ lat, lng, title, subtitle }]
 * route:   optional [[lat,lng], ...] to draw a simple (non-navigational) line
 */
export default function LeafletMap({ markers = [], route = null, height = 320, zoom = 12 }) {
  const valid = markers.filter((m) => typeof m.lat === 'number' && typeof m.lng === 'number');
  const center = valid.length ? [valid[0].lat, valid[0].lng] : [22.9734, 78.6569]; // India centroid

  return (
    <div className="overflow-hidden rounded-xl2 border border-sand-200" style={{ height }}>
      <MapContainer center={center} zoom={valid.length ? zoom : 4} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {valid.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]}>
            <Popup>
              <strong>{m.title}</strong>
              {m.subtitle && <div>{m.subtitle}</div>}
            </Popup>
          </Marker>
        ))}
        {route && route.length > 1 && <Polyline positions={route} pathOptions={{ color: '#E4841B', weight: 3, dashArray: '6 6' }} />}
      </MapContainer>
    </div>
  );
}
