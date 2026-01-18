"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Calendar, Heart, Share } from "lucide-react";
import { ManualEntryModal } from "./ManualEntryModal";

export function ApartmentDetailActions({ apartment }: { apartment: any }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this listing?")) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/apartments?id=${apartment.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                router.push("/");
                router.refresh();
            } else {
                alert("Failed to delete");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="flex gap-3 mb-8">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                >
                    <Pencil className="w-5 h-5" />
                    Edit Listing
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-4 border-2 border-gray-100 dark:border-zinc-800 rounded-2xl font-bold text-gray-400 hover:text-red-500 hover:border-red-100 dark:hover:border-red-900/30 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                    <Trash2 className={`w-5 h-5 ${isDeleting ? 'animate-pulse' : ''}`} />
                </button>
            </div>

            <ManualEntryModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                editData={apartment}
            />
        </>
    );
}
