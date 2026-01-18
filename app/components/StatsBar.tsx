import { TrendingUp, TrendingDown, Home, Plus } from "lucide-react";

export function StatsBar() {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div className="flex-1 min-w-[200px] bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Tel Aviv Avg</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">₪7,200</span>
          <span className="text-sm font-medium text-green-600 flex items-center gap-1">
             +2.1% <TrendingUp className="w-3 h-3" />
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-[200px] bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Ramat Gan Avg</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">₪5,800</span>
          <span className="text-sm font-medium text-red-600 flex items-center gap-1">
            -0.5% <TrendingDown className="w-3 h-3" />
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-[200px] bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Active Listings</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">48</span>
          <span className="text-sm font-medium text-primary">Live Now</span>
        </div>
      </div>
      <div className="flex-1 min-w-[200px] bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Added Today</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">12</span>
          <span className="text-sm font-medium text-green-600">+4</span>
        </div>
      </div>
    </div>
  );
}
