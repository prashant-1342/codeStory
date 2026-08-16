"use client";

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";

const features = [
  { icon: "◈", label: "Commit activity graphs" },
  { icon: "◉", label: "Most changed files" },
  { icon: "◎", label: "AI weekly summaries" },
  { icon: "○", label: "Per-repo deep dives" },
];

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  return (
    <main className="relative overflow-hidden bg-[#f5f0e8]">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/60 rounded-full blur-[100px] pointer-events-none" />

      <div className="min-h-screen flex items-center justify-center w-full relative z-10 py-12">
        <div className="w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <span className="text-[#f5f0e8] text-xs font-black tracking-tighter">CS</span>
              </div>
              <span className="text-gray-900 font-black text-xl tracking-tight uppercase">
                Code<span className="text-amber-600">Story</span>
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
                  Spotify Wrapped · For Developers
                </span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                Your code<br />has a story<span className="text-amber-600">.</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
                Connect GitHub. Get AI-powered breakdowns of everything you've been building.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <span className="text-amber-600 text-sm">{f.icon}</span>
                  <span className="text-gray-600 text-sm">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 shadow-[6px_6px_0px_0px_#1a1a1a] flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-gray-900 text-xl font-black uppercase tracking-tight">
                  Get Started
                </h2>
                <p className="text-gray-400 text-sm">
                  Login with your GitHub account to continue
                </p>
              </div>

              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-[3px_3px_0px_0px_#92400e] hover:shadow-[1px_1px_0px_0px_#92400e] hover:translate-x-0.5 hover:translate-y-0.5 uppercase tracking-wide text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>

              <p className="text-gray-400 text-xs text-center">
                We only read your repos. We never write or modify your code.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "30+", label: "Commits analyzed" },
                { value: "AI", label: "Powered summaries" },
                { value: "Free", label: "No credit card" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                  <div className="text-gray-900 font-black text-lg">{s.value}</div>
                  <div className="text-gray-400 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}