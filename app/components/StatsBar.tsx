"use client";

import { TrendingUp, TrendingDown, Home, Plus } from "lucide-react";
import { motion } from "framer-motion";

export function StatsBar() {
  const stats = [
    { label: "Tel Aviv Avg", value: "₪7,200", change: "+2.1%", trend: "up", color: "text-green-600" },
    { label: "Ramat Gan Avg", value: "₪5,800", change: "-0.5%", trend: "down", color: "text-red-600" },
    { label: "Active Listings", value: "48", change: "Live Now", trend: "none", color: "text-primary" },
    { label: "Added Today", value: "12", change: "+4", trend: "none", color: "text-green-600" },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {stats.map((stat, idx) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="flex-1 min-w-[200px] bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow cursor-default"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{stat.label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            <span className={`text-sm font-bold ${stat.color} flex items-center gap-1`}>
               {stat.change} 
               {stat.trend === "up" && <TrendingUp className="w-3 h-3" />}
               {stat.trend === "down" && <TrendingDown className="w-3 h-3" />}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
