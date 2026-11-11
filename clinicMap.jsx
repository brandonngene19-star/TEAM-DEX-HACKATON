import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon paths in Vite environments
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CLINICS = [
  { id: 1, name: "Clinique Bon Pasteur", lat: 4.0511, lng: 9.7679, area: "Akwa", fee: "2,500 FCFA", rating: "4.7 (1.2k)" },
  { id: 2, name: "Centre Médical Sainte-Thérèse", lat: 4.0748, lng: 9.7785, area: "Bonamoussadi", fee: "3,000 FCFA", rating: "4.5 (856)" },
  { id: 3, name: "Hôpital District Nyalla", lat: 3.9982, lng: 9.7915, area: "Nyalla", fee: "1,800 FCFA", rating: "4.6 (742)" }
];

// Helper to update tile layer dynamically when API key or provider changes
function DynamicTileLayer({ provider, apiKey }) {
  const map = useMap();

  useEffect(() => {
    let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"; // Default fallback
    let attribution = '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>';

    if (apiKey) {
      if (provider === 'stadia') {
        tileUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${apiKey}`;
        attribution = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>';
      } else if (provider === 'locationiq') {
        tileUrl = `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${apiKey}`;
        attribution = '&copy; <a href="https://locationiq.com/">LocationIQ</a>';
      } else if (provider === 'carto') {
        tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${apiKey}`;
        attribution = '&copy; <a href="https://carto.com/">CARTO</a>';
      }
    }

    const layer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
      referrerPolicy: "origin",
      crossOrigin: "anonymous"
    }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, provider, apiKey]);

  return null;
}

export default function ClinicMap({ onSelectClinic }) {
  const initialProvider = import.meta.env.VITE_MAP_PROVIDER || 'stadia';
  const initialApiKey = import.meta.env.VITE_MAP_API_KEY || '';

  const [apiKey, setApiKey] = useState(initialApiKey);
  const [provider, setProvider] = useState(initialProvider);
  const centerPosition = [4.0511, 9.7679]; // Douala Center

  return (
    <div className="space-y-3">
      {/* API Key Controller Bar */}
      <div className="bg-slate-900 text-white p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-400">Map Tile Provider:</span>
          <select 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="stadia">Stadia Maps</option>
            <option value="locationiq">LocationIQ</option>
            <option value="carto">CARTO</option>
          </select>
        </div>

        <div className="flex-1 max-w-sm flex items-center gap-2">
          <input
            type="text"
            placeholder={`Paste your ${provider} API Key here...`}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value.trim())}
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-lg px-3 py-1 focus:outline-none focus:border-blue-500"
          />
          {apiKey && (
            <button 
              onClick={() => setApiKey('')}
              className="text-slate-400 hover:text-white font-bold"
              title="Clear Key"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-md border border-slate-200">
        
        {/* Helper Prompt Overlay when API Key is Missing */}
        {!apiKey && (
          <div className="absolute inset-0 z-[400] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white p-5 rounded-2xl shadow-xl max-w-md text-center border border-slate-100">
              <span className="text-2xl block mb-2">🔑</span>
              <h4 className="font-bold text-slate-800 text-sm">Map API Key Required</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Paste your free <strong>{provider === 'stadia' ? 'Stadia Maps' : provider === 'locationiq' ? 'LocationIQ' : 'CARTO'}</strong> API key in the top bar above to load unwatermarked tile layers.
              </p>
            </div>
          </div>
        )}

        <MapContainer 
          center={centerPosition} 
          zoom={13} 
          scrollWheelZoom={false} 
          className="h-full w-full"
        >
          <DynamicTileLayer provider={provider} apiKey={apiKey} />

          {/* User Location Marker */}
          <Marker position={centerPosition}>
            <Popup>
              <div className="font-semibold text-blue-600">You are here</div>
            </Popup>
          </Marker>

          {/* Clinic Pins */}
          {CLINICS.map((clinic) => (
            <Marker key={clinic.id} position={[clinic.lat, clinic.lng]}>
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-slate-800">{clinic.name}</h4>
                  <p className="text-xs text-slate-500">{clinic.area} • {clinic.fee}</p>
                  <button 
                    onClick={() => onSelectClinic && onSelectClinic(clinic)}
                    className="mt-2 w-full bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}