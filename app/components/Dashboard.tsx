"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ApartmentCard } from "./ApartmentCard";
import { ChevronDown, ArrowUpDown, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Redundant definition to match lib/storage.ts content
export interface Apartment {
    id: string;
    userId?: string;
    url: string;
    price: string;
    address: string;
    contactPhone?: string;
    contactName?: string;
    entryDate?: string;
    hasParking?: boolean;
    rooms: number;
    floor: number;
    sqm: number;
    imageUrl: string;
    postedTime: string; // usually a date string
    description: string;
    addedAt: string;
    status: "active" | "visited" | "contacted" | "irrelevant";
    pros?: string[];
    cons?: string[];
    amenities?: Record<string, string>;
    location?: {
        lat: number;
        lng: number;
    };
}

interface DashboardProps {
    apartments: Apartment[];
}

export function Dashboard({ apartments }: DashboardProps) {
    const [cityFilter, setCityFilter] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [roomsFilter, setRoomsFilter] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<"newest" | "price_asc" | "price_desc">("newest");

    // Dropdown states
    const [activeDropdown, setActiveDropdown] = useState<"cities" | "price" | "rooms" | "sort" | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = (key: "cities" | "price" | "rooms" | "sort") => {
        setActiveDropdown(activeDropdown === key ? null : key);
    };

    // Extract unique cities
    const cities = useMemo(() => {
        const citySet = new Set<string>();
        apartments.forEach((apt) => {
            if (apt.address) {
                // Simple heuristic: Take last part after comma, or whole string if no comma
                // Assuming format "Street, City" or just "City"
                const parts = apt.address.split(",");
                const city = parts[parts.length - 1].trim();
                if (city) citySet.add(city);
            }
        });
        return Array.from(citySet).sort();
    }, [apartments]);

    // Extract unique room counts
    const availableRooms = useMemo(() => {
        const roomSet = new Set<number>();
        apartments.forEach((apt) => {
            if (apt.rooms) roomSet.add(apt.rooms);
        });
        return Array.from(roomSet).sort((a, b) => a - b);
    }, [apartments]);

    const parsePrice = (priceStr: string) => {
        return parseInt(priceStr.replace(/\D/g, ""), 10) || 0;
    };

    const filteredAndSortedApartments = useMemo(() => {
        return apartments
            .filter((apt) => {
                // City Filter
                if (cityFilter) {
                    const parts = apt.address.split(",");
                    const city = parts[parts.length - 1].trim();
                    if (city !== cityFilter) return false;
                }

                // Rooms Filter
                if (roomsFilter !== null) {
                    if (apt.rooms !== roomsFilter) return false;
                }

                // Price Filter
                const price = parsePrice(apt.price);
                if (minPrice !== null && price < minPrice) return false;
                if (maxPrice !== null && price > maxPrice) return false;

                return true;
            })
            .sort((a, b) => {
                switch (sortOrder) {
                    case "price_asc":
                        return parsePrice(a.price) - parsePrice(b.price);
                    case "price_desc":
                        return parsePrice(b.price) - parsePrice(a.price);
                    case "newest":
                    default:
                        // Assuming addedAt or postedTime is ISO or sortable string
                        // defaulting to addedAt (Time added to system) since postedTime might be "Just now"
                        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
                }
            });
    }, [apartments, cityFilter, roomsFilter, minPrice, maxPrice, sortOrder]);

    return (
        <>
            {/* Filter Row */}
            <div className="relative z-20 flex items-center justify-between mb-6" ref={dropdownRef}>
                <div className="flex gap-2">
                    {/* Cities Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown("cities")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${cityFilter
                                    ? "bg-primary/10 border-primary text-primary" // Active state
                                    : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-primary"
                                }`}
                        >
                            {cityFilter || "All Cities"}
                            <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "cities" ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                            {activeDropdown === "cities" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-xl p-2 z-50 overflow-hidden"
                                >
                                    <div className="max-h-64 overflow-y-auto">
                                        <button
                                            onClick={() => {
                                                setCityFilter(null);
                                                setActiveDropdown(null);
                                            }}
                                            className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-left"
                                        >
                                            <span className={!cityFilter ? "font-bold text-primary" : ""}>All Cities</span>
                                            {!cityFilter && <Check className="w-4 h-4 text-primary" />}
                                        </button>
                                        {cities.map((city) => (
                                            <button
                                                key={city}
                                                onClick={() => {
                                                    setCityFilter(city);
                                                    setActiveDropdown(null);
                                                }}
                                                className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-left"
                                            >
                                                <span className={city === cityFilter ? "font-bold text-primary" : ""}>{city}</span>
                                                {city === cityFilter && <Check className="w-4 h-4 text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Price Range Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown("price")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${minPrice || maxPrice
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-primary"
                                }`}
                        >
                            Price Range
                            <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "price" ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                            {activeDropdown === "price" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-xl p-4 z-50"
                                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                                >
                                    <div className="flex gap-3 mb-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                                            <input
                                                type="number"
                                                value={minPrice || ""}
                                                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
                                                placeholder="0"
                                                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-transparent focus:border-primary outline-none text-sm"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                                            <input
                                                type="number"
                                                value={maxPrice || ""}
                                                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                                                placeholder="No limit"
                                                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-transparent focus:border-primary outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => {
                                                setMinPrice(null);
                                                setMaxPrice(null);
                                            }}
                                            className="text-xs text-gray-500 hover:text-foreground"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={() => setActiveDropdown(null)}
                                            className="bg-primary text-white text-sm px-4 py-1.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Rooms Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown("rooms")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${roomsFilter !== null
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-primary"
                                }`}
                        >
                            {roomsFilter ? `${roomsFilter} Rooms` : "Rooms"}
                            <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "rooms" ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                            {activeDropdown === "rooms" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-xl p-2 z-50 overflow-hidden"
                                >
                                    <div className="max-h-64 overflow-y-auto">
                                        <button
                                            onClick={() => {
                                                setRoomsFilter(null);
                                                setActiveDropdown(null);
                                            }}
                                            className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-left"
                                        >
                                            <span className={roomsFilter === null ? "font-bold text-primary" : ""}>Any</span>
                                            {roomsFilter === null && <Check className="w-4 h-4 text-primary" />}
                                        </button>
                                        {availableRooms.map((rooms) => (
                                            <button
                                                key={rooms}
                                                onClick={() => {
                                                    setRoomsFilter(rooms);
                                                    setActiveDropdown(null);
                                                }}
                                                className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-left"
                                            >
                                                <span className={roomsFilter === rooms ? "font-bold text-primary" : ""}>{rooms} Rooms</span>
                                                {roomsFilter === rooms && <Check className="w-4 h-4 text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown("sort")}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-foreground transition-colors"
                    >
                        <ArrowUpDown className="w-4 h-4" />
                        Sort by: <span className="font-bold text-foreground">
                            {sortOrder === 'newest' && "Newest First"}
                            {sortOrder === 'price_asc' && "Price: Low to High"}
                            {sortOrder === 'price_desc' && "Price: High to Low"}
                        </span>
                    </button>
                    <AnimatePresence>
                        {activeDropdown === "sort" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-xl p-2 z-50"
                            >
                                {[
                                    { id: 'newest', label: 'Newest First' },
                                    { id: 'price_asc', label: 'Price: Low to High' },
                                    { id: 'price_desc', label: 'Price: High to Low' },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setSortOrder(option.id as any);
                                            setActiveDropdown(null);
                                        }}
                                        className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-left"
                                    >
                                        <span className={sortOrder === option.id ? "font-bold text-primary" : ""}>{option.label}</span>
                                        {sortOrder === option.id && <Check className="w-4 h-4 text-primary" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Apartment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedApartments.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        {apartments.length === 0 ? (
                            <>
                                <p>No apartments added yet.</p>
                                <p className="text-sm">Paste a Yad2 link in the sidebar to get started.</p>
                            </>
                        ) : (
                            <p>No apartments match your filters.</p>
                        )}
                    </div>
                ) : (
                    filteredAndSortedApartments.map((apt, index) => (
                        <ApartmentCard
                            key={apt.id}
                            {...apt}
                            status={apt.status || "active"}
                            index={index}
                        />
                    ))
                )}
            </div>
        </>
    );
}
