import { Sidebar } from "../components/Sidebar";
import MapWrapper from "../components/MapWrapper";
import { getApartments } from "@/lib/storage";

export const revalidate = 0;

export default async function MapPage() {
    const apartments = await getApartments();
    
    // Filter apartments that have location data (mock for now if needed, or real)
    // For demo purposes, we'll assign random locations around Tel Aviv if missing
    // in a real app, this should be done at scraping time.
    const apartmentsWithLoc = apartments.map(apt => {
        if (!apt.location) {
             // Use ID as seed for consistent fallback location
             const seed = apt.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
             return {
                 ...apt,
                 location: {
                     lat: 32.0853 + ((seed % 100) / 100 - 0.5) * 0.05,
                     lng: 34.7818 + ((seed % 77) / 77 - 0.5) * 0.05
                 }
             };
        }
        return apt;
    });

  return (
    <div className="flex h-screen overflow-hidden bg-[#fbfcfd] dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 ml-80 h-full relative z-0">
         <MapWrapper apartments={apartmentsWithLoc} />
      </main>
    </div>
  );
}
