import axios from 'axios';

interface GeocodingResult {
    lat: string;
    lon: string;
    display_name: string;
}

export async function getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        // Construct the URL for the Nominatim API
        // Prioritize results in Israel since this is likely the target based on previous context (Yad2, Hebrew)
        // limits to 1 result
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`;

        const response = await axios.get<GeocodingResult[]>(url, {
            headers: {
                // Nominatim requires a User-Agent to identify the application
                'User-Agent': 'ApartmentSearchApp/1.0',
                'Accept-Language': 'en-US,en;q=0.9,he;q=0.8' 
            }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon)
            };
        }

        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}
