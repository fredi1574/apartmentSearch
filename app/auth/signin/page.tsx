"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Home, Mail, User, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await signIn("credentials", {
      email,
      name,
      callbackUrl,
    });
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfcfd] dark:bg-zinc-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-primary/10 mb-4 border border-gray-100 dark:border-zinc-800">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-2">Sign in to manage your apartment search</p>
        </div>

        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/5 border border-white dark:border-zinc-800">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>Authentication failed. Please try again.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 ml-1 text-gray-700 dark:text-zinc-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 ml-1 text-gray-700 dark:text-zinc-300">Your Name (Optional)</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-zinc-500">
            For this demo, any email will work to create a private session.
          </p>
        </div>

        <Link 
          href="/" 
          className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
