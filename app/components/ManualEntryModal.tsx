"use client";

import { useState, useEffect } from "react";
import { X, Plus, Save, MapPin, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import LocationPicker from "./LocationPickerWrapper";

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any; // If provided, we are in edit mode
}

export function ManualEntryModal({ isOpen, onClose, editData }: ManualEntryModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    url: "",
    price: "",
    address: "",
    contactPhone: "",
    contactName: "",
    entryDate: "",
    hasParking: false,
    rooms: 0,
    floor: 0,
    sqm: 0,
    imageUrl: "",
    description: "",
    location: null as { lat: number; lng: number } | null,
    pros: [] as string[],
    cons: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [proInput, setProInput] = useState("");
  const [conInput, setConInput] = useState("");

  useEffect(() => {
    if (editData) {
      setFormData({
        url: editData.url || "",
        price: editData.price || "",
        address: editData.address || "",
        contactPhone: editData.contactPhone || "",
        contactName: editData.contactName || "",
        entryDate: editData.entryDate || "",
        hasParking: editData.hasParking || false,
        rooms: editData.rooms || 0,
        floor: editData.floor || 0,
        sqm: editData.sqm || 0,
        imageUrl: editData.imageUrl || "",
        description: editData.description || "",
        location: editData.location || null,
        pros: editData.pros || [],
        cons: editData.cons || [],
      });
    } else {
        setFormData({
            url: "",
            price: "",
            address: "",
            contactPhone: "",
            contactName: "",
            entryDate: "",
            hasParking: false,
            rooms: 0,
            floor: 0,
            sqm: 0,
            imageUrl: "",
            description: "",
            location: null,
            pros: [],
            cons: [],
          });
    }
  }, [editData, isOpen]);

  const handleGeocode = async () => {
    if (!formData.address) return;
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData(prev => ({
          ...prev,
          location: { lat: parseFloat(lat), lng: parseFloat(lon) }
        }));
      } else {
        alert("Could find this address on the map. Please try a more specific address or set it manually on the map.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Error searching for address. Using the map picker manually might be better.");
    } finally {
      setIsGeocoding(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        // Edit mode
        const res = await fetch("/api/apartments", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, id: editData.id }),
        });

        if (res.ok) {
          onClose();
          router.refresh();
        } else {
          alert("Failed to update apartment");
        }
      } else {
        // Create mode
        const submissionData = {
          ...formData,
          url: formData.url || `manual-${Date.now()}`,
          postedTime: new Date().toLocaleTimeString(),
        };

        const res = await fetch("/api/apartments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });

        if (res.ok) {
          onClose();
          router.refresh();
        } else {
          alert("Failed to save apartment");
        }
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-foreground">{editData ? "Edit Apartment" : "Add Apartment Manually"}</h2>
            <p className="text-sm text-gray-500">{editData ? "Update the details below" : "Fill in the details of the apartment"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form id="manual-entry-form" onSubmit={handleSubmit} className="p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Listing URL (optional)</label>
                <input
                    type="text"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://www.yad2.co.il/..."
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Price</label>
                <div className="relative">
                    <input
                        type="text"
                        required
                        className="w-full p-3 pr-10 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g. 3,600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₪</span>
                </div>
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Address</label>
                <div className="flex gap-2">
                  <input
                      type="text"
                      required
                      className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="City, Street, Number"
                  />
                  <button
                    type="button"
                    onClick={handleGeocode}
                    disabled={isGeocoding || !formData.address}
                    className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    title="Find on Map"
                  >
                    {isGeocoding ? <Loader2 className="w-5 h-5 animate-spin"/> : <Search className="w-5 h-5" />}
                  </button>
                </div>
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Contact Name</label>
                <input
                    type="text"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Owner/Agent Name"
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Phone Number</label>
                <input
                    type="tel"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="05x-xxxxxxx"
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Entry Date</label>
                <input
                    type="text"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                    value={formData.entryDate}
                    onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                    placeholder="Immediate, 01/02..."
                />
                </div>
                <div className="flex items-center gap-3 pt-8">
                <input
                    id="hasParking"
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary outline-none transition-all cursor-pointer"
                    checked={formData.hasParking}
                    onChange={(e) => setFormData({ ...formData, hasParking: e.target.checked })}
                />
                <label htmlFor="hasParking" className="text-sm font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer">Parking?</label>
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Rooms</label>
                <input
                    type="number"
                    step="0.5"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Floor</label>
                <input
                    type="number"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">SQM</label>
                <input
                    type="number"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.sqm}
                    onChange={(e) => setFormData({ ...formData, sqm: Number(e.target.value) })}
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Image URL</label>
                <input
                    type="text"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                />
                </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-600 uppercase flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Pros
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                            value={proInput}
                            onChange={(e) => setProInput(e.target.value)}
                            placeholder="Quiet street, Renovated..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (proInput.trim()) {
                                        setFormData(prev => ({ ...prev, pros: [...prev.pros, proInput.trim()] }));
                                        setProInput("");
                                    }
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (proInput.trim()) {
                                    setFormData(prev => ({ ...prev, pros: [...prev.pros, proInput.trim()] }));
                                    setProInput("");
                                }
                            }}
                            className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <ul className="flex flex-wrap gap-2 mt-2">
                        {formData.pros.map((pro, i) => (
                            <li key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-2 group border border-emerald-100">
                                {pro}
                                <button 
                                    type="button" 
                                    onClick={() => setFormData(prev => ({ ...prev, pros: prev.pros.filter((_, idx) => idx !== i) }))}
                                    className="hover:text-emerald-900"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-rose-500 uppercase flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Cons
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder:text-gray-400"
                            value={conInput}
                            onChange={(e) => setConInput(e.target.value)}
                            placeholder="No elevator, Expensive..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (conInput.trim()) {
                                        setFormData(prev => ({ ...prev, cons: [...prev.cons, conInput.trim()] }));
                                        setConInput("");
                                    }
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (conInput.trim()) {
                                    setFormData(prev => ({ ...prev, cons: [...prev.cons, conInput.trim()] }));
                                    setConInput("");
                                }
                            }}
                            className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <ul className="flex flex-wrap gap-2 mt-2">
                        {formData.cons.map((con, i) => (
                            <li key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-2 group border border-rose-100">
                                {con}
                                <button 
                                    type="button" 
                                    onClick={() => setFormData(prev => ({ ...prev, cons: prev.cons.filter((_, idx) => idx !== i) }))}
                                    className="hover:text-rose-900"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Description</label>
                    <textarea
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px] placeholder:text-gray-400"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Notes..."
                    />
                </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <label className="text-sm font-bold text-foreground">Set Exact Map Location</label>
            </div>
            <p className="text-xs text-gray-500 mb-4">Click on the map to place the marker. This location will be saved permanently.</p>
            <LocationPicker 
                initialLocation={formData.location}
                onLocationSelect={(loc) => setFormData({ ...formData, location: loc })}
            />
            {formData.location && (
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-[10px] font-mono text-primary">
                    Coordinates: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                </div>
            )}
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky bottom-0 z-10 flex gap-4">
          <button
            onClick={onClose}
            className="px-6 py-4 rounded-2xl border border-gray-200 dark:border-zinc-800 font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
          >
            Cancel
          </button>
          <button
            form="manual-entry-form"
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/10 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {loading ? "Saving..." : (editData ? "Save Changes" : "Add to Dashboard")}
            {editData ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
