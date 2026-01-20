import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getApartments } from "@/lib/storage";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id || session.user.email;
  const apartments = await getApartments(userId);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-80 min-h-screen p-8 bg-[#fbfcfd] dark:bg-zinc-950">
        <Dashboard apartments={apartments} />
      </main>
    </div>
  );
}
