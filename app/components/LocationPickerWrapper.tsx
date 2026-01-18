"use client";

import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import("./LocationPicker"), { 
    ssr: false,
    loading: () => <div className="h-48 w-full flex items-center justify-center bg-gray-50 rounded-xl">Loading Map Picker...</div>
});

export default LocationPicker;
