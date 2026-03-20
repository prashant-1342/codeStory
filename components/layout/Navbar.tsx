"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full border-b-2 border-gray-900 bg-[#f5f0e8] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
            <span className="text-[#f5f0e8] text-xs font-black tracking-tighter">CS</span>
          </div>
          <span className="text-gray-900 font-black text-xl tracking-tight uppercase">
            Code<span className="text-amber-600">Story</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {session && (
            <>
              <div className="flex items-center gap-2">
                <img
                  src={session.user?.image ?? ""}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-gray-900"
                />
                <span className="text-gray-600 text-sm font-medium hidden md:block">
                  {session.user?.name?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs font-black uppercase tracking-wide bg-white border-2 border-gray-900 px-4 py-2 rounded-lg shadow-[2px_2px_0px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_0px_#92400e] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 text-gray-900"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}