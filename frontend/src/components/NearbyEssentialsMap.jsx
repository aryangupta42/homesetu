import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Hospital, ShoppingCart, GraduationCap, Bus, 
  Utensils, CreditCard, Navigation, ExternalLink, Filter, 
  Clock, ShieldAlert, Sparkles, AlertCircle
} from 'lucide-react';
import { getNearbyEssentialsForPg } from '../api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issues in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORIES = [
  { id: 'all', label: 'All Essentials', icon: Filter },
  { id: 'hospital', label: 'Hospitals & Pharmacies', icon: Hospital, color: '#ef4444' },
  { id: 'grocery', label: 'Grocery & Markets', icon: ShoppingCart, color: '#10b981' },
  { id: 'college', label: 'Colleges & Campuses', icon: GraduationCap, color: '#3b82f6' },
  { id: 'transit', label: 'Metro & Bus Stops', icon: Bus, color: '#a855f7' },
  { id: 'food', label: 'Cafés & Food', icon: Utensils, color: '#f59e0b' },
  { id: 'atm', label: 'ATMs & Banks', icon: CreditCard, color: '#06b6d4' }
];

const RADII = [
  { id: 0.5, label: '500 m' },
  { id: 1.0, label: '1 km' },
  { id: 2.0, label: '2 km' },
  { id: 5.0, label: '5 km' }
];

export default function NearbyEssentialsMap({ pg }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [radiusKm, setRadiusKm] = useState(2.0);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const circleLayerRef = useRef(null);

  const pgLat = pg.latitude || pg.lat || 18.5074;
  const pgLng = pg.longitude || pg.lng || 73.8077;

  // Load essentials data
  const allEssentials = getNearbyEssentialsForPg(pg);

  // Filtered by radius and category
  const filteredPlaces = allEssentials.filter(p => {
    const withinRadius = p.distanceKm <= radiusKm;
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return withinRadius && matchCategory;
  });

  // Nearest highlights
  const nearestHospital = allEssentials.find(p => p.category === 'hospital');
  const nearestGrocery = allEssentials.find(p => p.category === 'grocery');
  const nearestCollege = allEssentials.find(p => p.category === 'college');
  const nearestTransit = allEssentials.find(p => p.category === 'transit');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [pgLat, pgLng],
        zoom: 14,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Home PG Center Marker
      const homeIcon = L.divIcon({
        className: 'custom-home-pin',
        html: `
          <div style="background: #f59e0b; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: black; font-weight: bold; font-size: 16px;">
            🏠
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      L.marker([pgLat, pgLng], { icon: homeIcon })
        .addTo(map)
        .bindPopup(`<strong>${pg.name}</strong><br/>Your PG Stay Location`)
        .openPopup();

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pgLat, pgLng]);

  // Update Markers & Radius Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    // Clear old markers
    markersLayerRef.current.clearLayers();

    // Remove old circle if exists
    if (circleLayerRef.current) {
      map.removeLayer(circleLayerRef.current);
    }

    // Add search radius circle
    circleLayerRef.current = L.circle([pgLat, pgLng], {
      color: '#f59e0b',
      fillColor: '#f59e0b',
      fillOpacity: 0.1,
      radius: radiusKm * 1000
    }).addTo(map);

    // Add markers for filtered places
    filteredPlaces.forEach(place => {
      const catConfig = CATEGORIES.find(c => c.id === place.category) || CATEGORIES[1];
      const pinColor = catConfig.color || '#3b82f6';

      const customPin = L.divIcon({
        className: 'custom-essential-pin',
        html: `
          <div style="background: ${pinColor}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 13px;">
            ${place.iconEmoji || '📍'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customPin });
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; color: #1e293b;">
          <strong>${place.name}</strong><br/>
          <span style="color: #64748b;">${catConfig.label}</span><br/>
          <strong style="color: #0f766e;">${place.distanceKm} km away (~${place.estTime})</strong><br/>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline; display: inline-block; margin-top: 4px;">
            Get Directions →
          </a>
        </div>
      `);
      markersLayerRef.current.addLayer(marker);
    });
  }, [filteredPlaces, radiusKm, pgLat, pgLng]);

  return (
    <div className="bg-[#082227] border border-[#17525e] rounded-2xl p-5 sm:p-6 text-white space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-800/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
              <MapPin className="w-4 h-4" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Nearby Essentials & Interactive OpenStreetMap
            </h4>
          </div>
          <p className="text-xs text-teal-300/80 mt-1">
            Real emergency, daily grocery, transit, and academic facilities surrounding this PG.
          </p>
        </div>

        {/* Radius Selector */}
        <div className="flex items-center gap-1.5 bg-[#0b2b32] p-1.5 rounded-xl border border-teal-800">
          <span className="text-[11px] text-teal-300/70 px-1 font-semibold">Radius:</span>
          {RADII.map(r => (
            <button
              key={r.id}
              onClick={() => setRadiusKm(r.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                radiusKm === r.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-teal-300 hover:text-white hover:bg-teal-900/40'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Emergency & High-Priority Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {nearestHospital && (
          <div className="bg-[#0b2b32] border border-red-500/40 rounded-xl p-3 flex flex-col justify-between hover:border-red-400 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60 uppercase">
                  Nearest Hospital
                </span>
                <Hospital className="w-4 h-4 text-red-400" />
              </div>
              <h5 className="font-bold text-white text-xs mt-2 truncate" title={nearestHospital.name}>
                {nearestHospital.name}
              </h5>
              <p className="text-[11px] text-teal-300/80">{nearestHospital.distanceKm} km (~{nearestHospital.estTime})</p>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${nearestHospital.lat},${nearestHospital.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-[11px] font-bold text-red-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Navigation className="w-3 h-3" /> Get Route
            </a>
          </div>
        )}

        {nearestGrocery && (
          <div className="bg-[#0b2b32] border border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-400 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 uppercase">
                  Nearest Grocery
                </span>
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
              </div>
              <h5 className="font-bold text-white text-xs mt-2 truncate" title={nearestGrocery.name}>
                {nearestGrocery.name}
              </h5>
              <p className="text-[11px] text-teal-300/80">{nearestGrocery.distanceKm} km (~{nearestGrocery.estTime})</p>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${nearestGrocery.lat},${nearestGrocery.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-[11px] font-bold text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Navigation className="w-3 h-3" /> Get Route
            </a>
          </div>
        )}

        {nearestCollege && (
          <div className="bg-[#0b2b32] border border-blue-500/40 rounded-xl p-3 flex flex-col justify-between hover:border-blue-400 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 uppercase">
                  Nearest Campus
                </span>
                <GraduationCap className="w-4 h-4 text-blue-400" />
              </div>
              <h5 className="font-bold text-white text-xs mt-2 truncate" title={nearestCollege.name}>
                {nearestCollege.name}
              </h5>
              <p className="text-[11px] text-teal-300/80">{nearestCollege.distanceKm} km (~{nearestCollege.estTime})</p>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${nearestCollege.lat},${nearestCollege.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-[11px] font-bold text-blue-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Navigation className="w-3 h-3" /> Get Route
            </a>
          </div>
        )}

        {nearestTransit && (
          <div className="bg-[#0b2b32] border border-purple-500/40 rounded-xl p-3 flex flex-col justify-between hover:border-purple-400 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 uppercase">
                  Nearest Transit
                </span>
                <Bus className="w-4 h-4 text-purple-400" />
              </div>
              <h5 className="font-bold text-white text-xs mt-2 truncate" title={nearestTransit.name}>
                {nearestTransit.name}
              </h5>
              <p className="text-[11px] text-teal-300/80">{nearestTransit.distanceKm} km (~{nearestTransit.estTime})</p>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${nearestTransit.lat},${nearestTransit.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-[11px] font-bold text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Navigation className="w-3 h-3" /> Get Route
            </a>
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-[#0b2b32] border-teal-800 text-teal-300/80 hover:bg-[#0e3740] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Map & Place List Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leaflet Map Box */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-teal-800 h-[360px] relative shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full z-10" />
          <div className="absolute top-3 right-3 z-[400] bg-[#092227]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-teal-700/60 text-[11px] text-teal-200">
            OpenStreetMap Engine • Real Coords
          </div>
        </div>

        {/* Places List within Radius */}
        <div className="bg-[#0b2b32] border border-teal-800/80 rounded-2xl p-4 flex flex-col justify-between h-[360px]">
          <div className="flex items-center justify-between border-b border-teal-800 pb-2 mb-2">
            <span className="text-xs font-bold text-white">
              Places Found ({filteredPlaces.length})
            </span>
            <span className="text-[10px] text-amber-300 font-semibold">
              Within {radiusKm} km
            </span>
          </div>

          <div className="overflow-y-auto space-y-2 flex-1 pr-1">
            {filteredPlaces.length === 0 ? (
              <div className="text-center py-12 text-teal-300/60 text-xs">
                No essentials found within {radiusKm} km. Try increasing search radius to 5 km.
              </div>
            ) : (
              filteredPlaces.map((place, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#081d21] border border-teal-800/80 hover:border-teal-600 transition-all text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span>{place.iconEmoji || '📍'}</span>
                      <strong className="text-white truncate block">{place.name}</strong>
                    </div>
                    <div className="text-[11px] text-teal-300/70 mt-0.5">
                      {place.distanceKm} km away • ~{place.estTime}
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Get Directions on Google Maps"
                    className="p-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-700 text-teal-200 hover:text-white transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-teal-800/60 pt-2 text-[10px] text-teal-400/70 text-center">
            Click any pin on map or arrow to open Google Maps GPS turn-by-turn directions.
          </div>
        </div>
      </div>
    </div>
  );
}
