import { Sidebar } from "../../components/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  Share, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
} from "lucide-react";
import { getApartment } from "@/lib/storage";
import MapWrapper from "../../components/MapWrapper";

export default async function ApartmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apt = await getApartment(id);

  if (!apt) {
      return (
          <div className="flex bg-[#fbfcfd] dark:bg-zinc-950 min-h-screen items-center justify-center">
             <div className="text-center">
                 <h1 className="text-2xl font-bold">Apartment Not Found</h1>
                 <Link href="/" className="text-primary hover:underline mt-4 block">Return Home</Link>
             </div>
          </div>
      )
  }

  // Ensure apartment has a location for the map
  const seed = apt.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const aptWithLoc = {
      ...apt,
      location: apt.location || {
          lat: 32.0853 + ((seed % 100) / 100 - 0.5) * 0.01,
          lng: 34.7818 + ((seed % 77) / 77 - 0.5) * 0.01
      }
  };

  const isHebrew = (text?: string) => text ? /[\u0590-\u05FF]/.test(text) : false;

  const pros = apt.pros || [];
  const cons = apt.cons || [];
  const amenities = apt.amenities || { floor_text: `Floor ${apt.floor}`, elevator: '?', balcony: '?', pets: '?' };

  return (
    <div className="flex min-h-screen bg-[#fbfcfd] dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 ml-80 flex relative">
        {/* Detail Panel (Now on the Left) */}
        <div className="w-full xl:w-[600px] bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 shadow-xl flex flex-col h-screen overflow-y-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
            <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500">
                <Share className="w-5 h-5" />
              </button>
            </div>
            <Link href="/" className="p-2 rounded-full hover:bg-red-50 text-red-500">
              <X className="w-5 h-5" />
            </Link>
          </div>

          {/* Image */}
          <div className="relative h-72 w-full bg-gray-100 dark:bg-zinc-800 group">
             {apt.imageUrl ? (
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${apt.imageUrl}")` }}
                />
             ): (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                     <span className="text-gray-400">No Image</span>
                 </div>
             )}

             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6" dir={isHebrew(apt.address) ? "rtl" : "ltr"}>
              <div>
                <h2 className="text-2xl font-black text-foreground leading-tight">{apt.address}</h2>
                <p className="text-gray-500 font-medium flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" /> Listed {apt.postedTime}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-primary leading-none">{apt.price}</p>
                <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-tighter">+ Va'ad Bayit</p>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                <Calendar className="w-5 h-5" />
                Schedule Visit
              </button>
              <button className="px-5 py-3 border-2 border-gray-100 dark:border-zinc-800 rounded-xl font-bold text-foreground hover:bg-gray-50 dark:hover:bg-zinc-800">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center">
                 <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Rooms</p>
                 <p className="text-sm font-black text-foreground">{apt.rooms}</p>
               </div>
               <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center">
                 <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Floor</p>
                 <p className="text-sm font-black text-foreground">{apt.floor}</p>
               </div>
               <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center">
                 <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Parking</p>
                 <p className="text-sm font-black text-foreground">{apt.hasParking ? "Yes" : "No"}</p>
               </div>
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center">
                 <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Entry Date</p>
                 <p className="text-sm font-black text-foreground" dir="rtl">{apt.entryDate || "Not set"}</p>
               </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Pros
                </h4>
                <ul className="text-sm space-y-3 font-medium text-foreground">
                  {pros.length > 0 ? pros.map((pro: string, i: number) => (
                    <li key={i} className="flex items-start gap-2" dir={isHebrew(pro) ? "rtl" : "ltr"}>• {pro}</li>
                  )) : <li className="text-gray-400 italic">No pros listed</li>}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-rose-500 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Cons
                </h4>
                <ul className="text-sm space-y-3 font-medium text-foreground">
                   {cons.length > 0 ? cons.map((con: string, i: number) => (
                    <li key={i} className="flex items-start gap-2" dir={isHebrew(con) ? "rtl" : "ltr"}>• {con}</li>
                  )) :  <li className="text-gray-400 italic">No cons listed</li>}
                </ul>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-3">Description</h3>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line" dir={isHebrew(apt.description) ? "rtl" : "ltr"}>
                {apt.description || "No description available."}
              </p>
            </div>

            <Link 
                href={apt.url} 
                target="_blank"
                className="w-full py-4 border-2 border-gray-100 dark:border-zinc-800 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-foreground"
            >
              <ExternalLink className="w-5 h-5" />
              View Original Yad2 Listing
            </Link>
          </div>
        </div>

        {/* Map View Background (Now on the Right) */}
        <div className="flex-1 h-full relative z-0">
          <MapWrapper 
            apartments={[aptWithLoc]} 
            center={[aptWithLoc.location.lat, aptWithLoc.location.lng]} 
            zoom={15} 
          />
        </div>
      </main>
    </div>
  );
}
