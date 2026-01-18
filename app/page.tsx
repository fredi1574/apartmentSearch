import { Sidebar } from "./components/Sidebar";
import { ApartmentCard } from "./components/ApartmentCard";
import { StatsBar } from "./components/StatsBar";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getApartments } from "@/lib/storage";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id || session.user.email;
  const apartments = await getApartments(userId);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-80 min-h-screen p-8 bg-[#fbfcfd] dark:bg-zinc-950">
        <StatsBar />
        
        {/* Filter Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm font-medium hover:border-primary transition-colors">
              All Cities <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm font-medium hover:border-primary transition-colors">
              Price Range <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm font-medium hover:border-primary transition-colors">
              Rooms <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ArrowUpDown className="w-4 h-4" />
            Sort by: <span className="font-bold text-foreground">Newest First</span>
          </div>
        </div>

        {/* Apartment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {apartments.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400">
                  <p>No apartments added yet.</p>
                  <p className="text-sm">Paste a Yad2 link in the sidebar to get started.</p>
              </div>
          ) : (
            apartments.map((apt: any, index: number) => (
                <ApartmentCard key={apt.id} {...apt} status={apt.status || 'active'} index={index} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
