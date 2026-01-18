"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Search,
  Loader2,
  Plus,
  Briefcase,
  LogOut,
  User
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ManualEntryModal } from "./ManualEntryModal";
import { useUserSettings } from "@/lib/UserSettingsContext";

import { motion } from "framer-motion";

export function Sidebar() {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const { workLocation, setWorkLocation } = useUserSettings();
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const scrapeRes = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const scrapeData = await scrapeRes.json();
      
      if (!scrapeData.success) {
          alert('Failed to scrape: ' + scrapeData.error + '\n\nPlease try manual entry.');
          return;
      }

      const saveRes = await fetch('/api/apartments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scrapeData.data)
      });
      
      if (saveRes.ok) {
          setUrl("");
          router.refresh();
      } else {
          alert('Failed to save apartment');
      }

    } catch (e) {
      console.error(e);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/map", label: "Map View", icon: MapIcon },
  ];

  return (
    <>
      <aside className="w-80 border-r border-gray-100 dark:border-zinc-800 flex flex-col fixed inset-y-0 bg-white dark:bg-zinc-900 z-20">
        <div className="p-6 flex flex-col h-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">Apartment Hub</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Manage your rental hunt</p>
            </div>
          </motion.div>
          
          <nav className="space-y-1 mb-6">
            {menuItems.map((item, idx) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <Link 
                  href={item.href} 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    idx === 0 ? "bg-primary/5 text-primary" : "text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${idx === 0 ? "text-primary" : "group-hover:text-primary transition-colors"}`} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">My Work Location</span>
            </div>
            {workLocation ? (
              <div className="space-y-2">
                <p className="text-xs text-foreground font-medium line-clamp-1">
                  📍 {workLocation.lat.toFixed(4)}, {workLocation.lng.toFixed(4)}
                </p>
                <button 
                  onClick={() => setWorkLocation(null)}
                  className="text-[10px] text-red-500 font-bold hover:underline"
                >
                  Clear Location
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">
                No location set. Click on the map to set your office.
              </p>
            )}
          </motion.div>
          
          <div className="mt-auto space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 pb-6 border-b border-gray-100 dark:border-zinc-800"
            >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsManualModalOpen(true)}
                  className="w-full bg-white dark:bg-zinc-900 border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group shadow-sm hover:shadow-primary/20"
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  Manual Entry
                </motion.button>

                <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-white dark:bg-zinc-900 px-2 text-gray-400 font-medium tracking-wider">or auto-import</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <input 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 p-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-foreground" 
                        placeholder="Paste Yad2 link..." 
                        type="text"
                    />
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full bg-zinc-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                        >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Search className="w-5 h-5" />}
                        {loading ? 'Analyzing...' : 'Analyze Link'}
                    </motion.button>
                </div>
            </motion.div>

            {/* Profile Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 p-2 rounded-2xl bg-gray-50/50 dark:bg-zinc-800/30"
            >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{session?.user?.name || "User"}</p>
                    <p className="text-[10px] text-gray-500 truncate">{session?.user?.email}</p>
                </div>
                <button 
                    onClick={() => signOut()}
                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </motion.div>
          </div>
        </div>
      </aside>

      <ManualEntryModal 
        isOpen={isManualModalOpen} 
        onClose={() => setIsManualModalOpen(false)} 
      />
    </>
  );
}
