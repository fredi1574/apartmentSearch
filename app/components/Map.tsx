"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { useUserSettings } from "@/lib/UserSettingsContext";

// Fix Leaflet marker icon issue
const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const workIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Location {
  lat: number;
  lng: number;
}

interface Apartment {
  id: string;
  address: string;
  price: string;
  location?: Location;
  imageUrl?: string;
}

function LocationMarker({ 
    position, 
    setPosition 
}: { 
    position: Location | null, 
    setPosition: (pos: Location) => void 
}) {
    useMapEvents({
        dblclick(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={workIcon}>
            <Popup>Work Location <br/> (Reference Point)</Popup>
        </Marker>
    );
}

function calculateDistance(pos1: Location, pos2: Location) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(pos2.lat - pos1.lat);
    const dLng = deg2rad(pos2.lng - pos1.lng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(pos1.lat)) * Math.cos(deg2rad(pos2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export default function Map({ 
    apartments, 
    center, 
    zoom = 13 
}: { 
    apartments: Apartment[], 
    center?: [number, number],
    zoom?: number
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { workLocation, setWorkLocation } = useUserSettings();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 font-medium">Loading Map...</div>;

  // Center on Tel Aviv by default or the first apartment or provided center
  const mapCenter: [number, number] = center || 
    (apartments.length > 0 && apartments[0].location ? [apartments[0].location.lat, apartments[0].location.lng] : [32.0853, 34.7818]);

  return (
    <div className="relative h-full w-full">
        <MapContainer 
            center={mapCenter} 
            zoom={zoom} 
            style={{ height: "100%", width: "100%" }} 
            scrollWheelZoom={true}
            doubleClickZoom={false}
        >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <LocationMarker position={workLocation} setPosition={setWorkLocation} />

        {apartments.map((apt) => 
            apt.location ? (
            <Marker key={apt.id} position={[apt.location.lat, apt.location.lng]} icon={icon}>
                <Popup>
                <div className="min-w-[200px]">
                    <div className="font-bold mb-1">{apt.address}</div>
                    <div className="text-primary font-bold mb-2">{apt.price}</div>
                    
                    {workLocation && (
                        <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs">
                            <span className="font-bold">Distance to Work:</span>
                            <br/> 
                            {calculateDistance(workLocation, apt.location)} km (Linear)
                        </div>
                    )}

                    <Link href={`/apartment/${apt.id}`} className="text-blue-500 hover:underline text-sm">
                    View Details
                    </Link>
                </div>
                </Popup>
            </Marker>
            ) : null
        )}
        </MapContainer>
        
        {!workLocation && (
          <div className="absolute top-4 left-4 right-4 md:right-auto md:w-64 bg-white/90 backdrop-blur shadow-xl rounded-2xl p-4 border border-blue-100 z-[1000]">
              <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-rose-500" />
                  <h4 className="font-bold text-sm text-slate-900">Add Work Location</h4>
              </div>
              <p className="text-[10px] text-slate-500">Double-click anywhere on the map to set your work reference point and see distances.</p>
          </div>
        )}
    </div>
  );
}
