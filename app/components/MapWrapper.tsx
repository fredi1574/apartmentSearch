"use client";

import dynamic from 'next/dynamic';

const Map = dynamic(() => import("./Map"), { 
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-50">Loading Map...</div>
});

export default function MapWrapper({ 
  apartments, 
  center, 
  zoom 
}: { 
  apartments: any[], 
  center?: [number, number],
  zoom?: number
}) {
  return <Map apartments={apartments} center={center} zoom={zoom} />;
}
