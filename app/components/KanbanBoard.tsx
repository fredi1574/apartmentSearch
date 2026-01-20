"use client";

import { Apartment } from "@/lib/storage";
import { AnimatePresence, motion } from "framer-motion";
import { Bed, Ruler } from "lucide-react";
import { useMemo, useState } from "react";

interface KanbanBoardProps {
    initialApartments: Apartment[];
}

type Status = "active" | "contacted" | "visited" | "irrelevant";

const COLUMNS: { id: Status; title: string; color: string }[] = [
    { id: "active", title: "Active", color: "bg-blue-500" },
    { id: "contacted", title: "Contacted", color: "bg-yellow-500" },
    { id: "visited", title: "Visited", color: "bg-green-600" },
    { id: "irrelevant", title: "Irrelevant", color: "bg-gray-400" },
];

export function KanbanBoard({ initialApartments }: KanbanBoardProps) {
    const [apartments, setApartments] = useState(initialApartments);
    const [activeDrag, setActiveDrag] = useState<string | null>(null);

    // Group apartments by status
    const columns = useMemo(() => {
        const cols: Record<Status, Apartment[]> = {
            active: [],
            contacted: [],
            visited: [],
            irrelevant: [],
        };
        apartments.forEach((apt) => {
            const status = apt.status || "active";
            if (cols[status]) {
                cols[status].push(apt);
            } else {
                // Fallback for unknown status
                cols["active"].push(apt);
            }
        });
        return cols;
    }, [apartments]);

    const handleStatusChange = async (cardId: string, newStatus: Status) => {
        // Optimistic update
        setApartments((prev) =>
            prev.map((apt) => (apt.id === cardId ? { ...apt, status: newStatus } : apt))
        );

        try {
            await fetch("/api/apartments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: cardId, status: newStatus }),
            });
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on failure (could implement more robust rollback)
        }
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("cardId", id);
        setActiveDrag(id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: Status) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("cardId");
        if (cardId) {
            handleStatusChange(cardId, status);
        }
        setActiveDrag(null);
    };

    return (
        <div className="h-full overflow-x-auto p-6">
            <div className="flex gap-6 h-full min-w-[1000px]">
                {COLUMNS.map((col) => (
                    <div
                        key={col.id}
                        className="flex-1 flex flex-col min-w-[300px] h-full rounded-2xl bg-gray-50/50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        {/* Column Header */}
                        <div className={`p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-inherit rounded-t-2xl z-10`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${col.color}`} />
                                <h3 className="font-bold text-foreground">{col.title}</h3>
                                <span className="text-xs text-gray-400 font-medium ml-1">
                                    {columns[col.id].length}
                                </span>
                            </div>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            <AnimatePresence>
                                {columns[col.id].map((apt) => (
                                    <motion.div
                                        layout
                                        layoutId={apt.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={apt.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, apt.id)}
                                        className={`bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors group relative ${activeDrag === apt.id ? 'opacity-50' : ''}`}
                                    >
                                        <div className="mb-2">
                                            <h4 className="font-bold text-foreground">{apt.price}₪</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{apt.address}</p>
                                        </div>

                                        {apt.imageUrl && (
                                            <div className="w-full h-24 mb-3 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden relative">
                                                {/* Using simple img for dragging compatibility (sometimes next/image causes issues with drag previews) */}
                                                <img src={apt.imageUrl} alt="" className="w-full h-full object-cover pointer-events-none" />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Bed className="w-3 h-3" />
                                                <span>{apt.rooms}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Ruler className="w-3 h-3" />
                                                <span>{apt.sqm}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {columns[col.id].length === 0 && (
                                <div className="h-32 flex items-center justify-center text-gray-300 dark:text-zinc-700 text-sm italic border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-xl">
                                    Drop here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
