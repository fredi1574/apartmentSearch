import { Sidebar } from "../components/Sidebar";
import MapWrapper from "../components/MapWrapper";
import { getApartments } from "@/lib/storage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function MapPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id || session.user.email;
  const apartments = await getApartments(userId);

  const apartmentsWithLoc = apartments.filter(apt => apt.location && apt.location.lat && apt.location.lng);

  return (
    <div className="flex h-screen overflow-hidden bg-[#fbfcfd] dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 ml-80 h-full relative z-0">
        <MapWrapper apartments={apartmentsWithLoc} />
      </main>
    </div>
  );
}
