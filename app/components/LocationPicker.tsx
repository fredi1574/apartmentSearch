"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useState, useEffect } from "react";

const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Location {
  lat: number;
  lng: number;
}

function ClickHandler({ onLocationSelect }: { onLocationSelect: (loc: Location) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function LocationPicker({ 
  initialLocation, 
  onLocationSelect 
}: { 
  initialLocation?: Location | null, 
  onLocationSelect: (loc: Location) => void 
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [marker, setMarker] = useState<Location | null>(initialLocation || null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (initialLocation) setMarker(initialLocation);
  }, [initialLocation]);

  if (!isMounted) return <div className="h-48 w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map Picker...</div>;

  const defaultCenter: [number, number] = initialLocation ? [initialLocation.lat, initialLocation.lng] : [32.0853, 34.7818];

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onLocationSelect={(loc) => {
          setMarker(loc);
          onLocationSelect(loc);
        }} />
        {marker && <Marker position={[marker.lat, marker.lng]} icon={icon} />}
      </MapContainer>
    </div>
  );
}
