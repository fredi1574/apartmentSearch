import { Sidebar } from "../../components/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  Share, 
  X, 
  Clock, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  MapPin,
  Home,
  Tag,
  Calendar,
} from "lucide-react";
import { getApartment } from "@/lib/storage";
import MapWrapper from "../../components/MapWrapper";
import { ApartmentDetailActions } from "../../components/ApartmentDetailActions";

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

  return (
    <div className="flex min-h-screen bg-[#fbfcfd] dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 ml-80 flex relative">
        {/* Detail Panel */}
        <div className="w-full xl:w-[550px] bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 shadow-2xl flex flex-col h-screen overflow-y-auto relative z-10 scrollbar-hide">
          {/* Header */}
          <div className="flex items-center justify-between p-4 absolute top-0 left-0 right-0 z-20 pointer-events-none">
            <Link href="/" className="p-2 rounded-xl bg-white/90 dark:bg-black/40 backdrop-blur-md shadow-md border border-white/20 hover:scale-105 transition-all pointer-events-auto">
              <X className="w-4 h-4 text-gray-800 dark:text-gray-200" />
            </Link>
            <div className="flex gap-2 pointer-events-auto">
              <button className="p-2 rounded-xl bg-white/90 dark:bg-black/40 backdrop-blur-md shadow-md border border-white/20 hover:scale-105 transition-all">
                <Share className="w-4 h-4 text-gray-800 dark:text-gray-200" />
              </button>
              <button className="p-2 rounded-xl bg-white/90 dark:bg-black/40 backdrop-blur-md shadow-md border border-white/20 hover:scale-105 transition-all group">
                <Heart className="w-4 h-4 text-gray-800 dark:text-gray-200 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>

          {/* Hero Section - Reduced Height */}
          <div className="relative h-[240px] w-full shrink-0">
             {apt.imageUrl ? (
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${apt.imageUrl}")` }}
                />
             ): (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-zinc-800">
                     <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No Property Image</span>
                 </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 via-transparent to-black/10" />
          </div>

          <div className="p-6 pt-2">
            {/* Title & Price Header */}
            <div className="mb-6" dir={isHebrew(apt.address) ? "rtl" : "ltr"}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-wider">
                            {apt.status || 'Active'}
                        </div>
                        {apt.hasParking && (
                            <div className="px-2 py-0.5 rounded-full bg-zinc-900 dark:bg-white dark:text-black text-white text-[9px] font-black uppercase tracking-wider">
                                Parking
                            </div>
                        )}
                    </div>
                    <div className="bg-primary px-4 py-2 rounded-2xl shadow-lg shadow-primary/20">
                        <p className="text-xl font-black text-white">{apt.price}</p>
                    </div>
                </div>
                <h2 className="text-2xl font-black text-foreground leading-tight mb-2">{apt.address}</h2>
                <div className="flex items-center gap-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {apt.postedTime}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Added {new Date(apt.addedAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Main Actions - More compact */}
            <ApartmentDetailActions apartment={apt} />

            {/* Fact Grid - Smaller cards */}
            <div className="grid grid-cols-4 gap-3 mb-6">
               <div className="py-3 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50 flex flex-col items-center justify-center">
                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Rooms</p>
                 <p className="text-base font-black text-foreground">{apt.rooms}</p>
               </div>
               <div className="py-3 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50 flex flex-col items-center justify-center">
                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">SQM</p>
                 <p className="text-base font-black text-foreground">{apt.sqm}</p>
               </div>
               <div className="py-3 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50 flex flex-col items-center justify-center">
                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Floor</p>
                 <p className="text-base font-black text-foreground">{apt.floor}</p>
               </div>
                <div className="py-3 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 flex flex-col items-center justify-center font-bold">
                 <p className="text-[8px] font-bold text-primary uppercase tracking-widest mb-0.5">Entry</p>
                 <p className="text-sm font-black text-primary" dir="rtl">{apt.entryDate || "Immediate"}</p>
               </div>
            </div>

            {/* Pros & Cons Section - Two column compact */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="p-4 bg-emerald-50/30 dark:bg-emerald-500/5 rounded-3xl border border-emerald-100/50 dark:border-emerald-500/10">
                 <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                   <CheckCircle className="w-3 h-3" /> Pros
                 </h4>
                 <ul className="space-y-2">
                   {pros.length > 0 ? pros.slice(0, 4).map((pro: string, i: number) => (
                     <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-emerald-900 dark:text-emerald-400" dir={isHebrew(pro) ? "rtl" : "ltr"}>
                        <div className="shrink-0 w-1 h-1 bg-emerald-500 rounded-full" /> <span className="line-clamp-1">{pro}</span>
                     </li>
                   )) : <li className="text-gray-400 italic text-[10px]">None listed.</li>}
                 </ul>
               </div>

               <div className="p-4 bg-rose-50/30 dark:bg-rose-500/5 rounded-3xl border border-rose-100/50 dark:border-rose-500/10">
                 <h4 className="text-[9px] font-black uppercase tracking-widest text-rose-500 mb-3 flex items-center gap-2">
                   <XCircle className="w-3 h-3" /> Cons
                 </h4>
                 <ul className="space-y-2">
                   {cons.length > 0 ? cons.slice(0, 4).map((con: string, i: number) => (
                     <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-rose-900 dark:text-rose-400" dir={isHebrew(con) ? "rtl" : "ltr"}>
                        <div className="shrink-0 w-1 h-1 bg-rose-500 rounded-full" /> <span className="line-clamp-1">{con}</span>
                     </li>
                   )) : <li className="text-gray-400 italic text-[10px]">None listed.</li>}
                 </ul>
               </div>
            </div>

            {/* Description - More compact font/spacing */}
            <div className="mb-6 p-5 bg-gray-50/20 dark:bg-zinc-800/10 rounded-3xl border border-gray-100 dark:border-zinc-800/50">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Description</h3>
              <p className="text-sm leading-snug text-foreground/80 font-medium whitespace-pre-line line-clamp-[6]" dir={isHebrew(apt.description) ? "rtl" : "ltr"}>
                {apt.description || "No description provided."}
              </p>
            </div>

            <Link 
                href={apt.url} 
                target="_blank"
                className="w-full py-4 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-xl shadow-black/10"
            >
              <ExternalLink className="w-4 h-4" />
              Open Original Listing
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
