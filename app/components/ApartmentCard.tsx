"use client";

import { Heart, Bed, Layers, Ruler, Trash2, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ManualEntryModal } from "./ManualEntryModal";

import { motion } from "framer-motion";

interface ApartmentProps {
  id: string;
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
  postedTime?: string;
  status: "active" | "visited" | "contacted" | "irrelevant";
  index?: number;
}

export function ApartmentCard(props: ApartmentProps) {
  const {
    id,
    price,
    address,
    contactPhone,
    contactName,
    entryDate,
    hasParking,
    rooms,
    floor,
    sqm,
    imageUrl,
    postedTime = "Just now",
    status,
    index = 0
  } = props;
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const statusStyles = {
    active: "",
    contacted: "bg-status-contact text-[#7a5a00]",
    visited: "bg-status-visited text-[#1b5e20]",
    irrelevant: "bg-status-irrelevant text-gray-600"
  };

  const statusLabel = {
    active: null,
    contacted: "Contacted",
    visited: "Visited",
    irrelevant: "Irrelevant"
  };

  const handleFavorite = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement favorite logic
    console.log("Favorite clicked for", id);
  };

  const handleEdit = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDelete = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this listing?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/apartments?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -5 }}
        className="h-full"
      >
        <Link
          href={`/apartment/${id}`}
          className={`group block h-full bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 ${status === 'irrelevant' ? 'opacity-70 grayscale-[0.5]' : ''} ${isDeleting ? 'opacity-50 scale-[0.98]' : ''}`}
        >
          <div className="relative aspect-[16/10] bg-gray-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url("${imageUrl}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-3 right-3 flex gap-2">
              {hasParking && (
                <div className="px-2 py-1 rounded-md bg-white/90 dark:bg-black/50 backdrop-blur-sm text-[10px] font-bold uppercase text-primary border border-primary/20 z-10">
                  Parking
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEdit}
                className="p-2 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm text-gray-400 hover:text-primary transition-colors z-10 shadow-sm"
                title="Edit listing"
              >
                <Pencil className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm text-gray-400 hover:text-red-500 transition-colors z-10 shadow-sm"
                title="Delete listing"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                className="p-2 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm text-foreground hover:text-red-500 transition-colors z-10 shadow-sm"
              >
                <Heart className="w-4 h-4" />
              </motion.button>
            </div>
            {status !== 'active' && (
              <div className="absolute bottom-3 left-3">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-sm ${statusStyles[status]}`}>
                  {statusLabel[status]}
                </span>
              </div>
            )}
          </div>
          <div className="p-5">
            <div className="mb-2">
              <h3 className={`text-xl font-bold text-foreground transition-colors group-hover:text-primary ${status === 'irrelevant' ? 'line-through' : ''}`}>
                {price}₪ <span className="text-sm font-normal text-gray-500">/ mo</span>
              </h3>
            </div>
            <p className="text-foreground dark:text-zinc-200 font-semibold mb-3 line-clamp-1">{address}</p>
            <div className="flex justify-between items-center mb-4">
              {(contactPhone || contactName) ? (
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  {contactName ? `${contactName}: ` : ""}{contactPhone}
                </p>
              ) : <div />}
              {entryDate && (
                <p className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">כניסה: {entryDate}</p>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-zinc-400 pt-4 border-t border-gray-50 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                <Bed className="w-[18px] h-[18px]" />
                <span className="font-medium">{rooms} Rooms</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                <Layers className="w-[18px] h-[18px]" />
                <span className="font-medium">Floor {floor}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                <Ruler className="w-[18px] h-[18px]" />
                <span className="font-medium">{sqm} sqm</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
      <ManualEntryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editData={props}
      />
    </>
  );
}
