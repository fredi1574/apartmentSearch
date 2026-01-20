import { Sidebar } from "../components/Sidebar";
import { KanbanBoard } from "../components/KanbanBoard";
import { getApartments } from "@/lib/storage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function KanbanPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/api/auth/signin");
    }

    const userId = (session.user as any).id || session.user.email;
    const apartments = await getApartments(userId);

    return (
        <div className="flex h-screen overflow-hidden bg-[#fbfcfd] dark:bg-zinc-950">
            <Sidebar />
            <main className="flex-1 ml-80 h-full relative overflow-hidden">
                <KanbanBoard initialApartments={apartments} />
            </main>
        </div>
    );
}
