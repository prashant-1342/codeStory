import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-gray-900 bg-[#f5f0e8] py-6 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
            <span className="text-[#f5f0e8] text-[10px] font-black tracking-tighter">CS</span>
          </div>
          <span className="text-gray-900 font-black text-sm tracking-tight uppercase">
            Code<span className="text-amber-600">Story</span>
          </span>
        </div>

        <div className="text-center sm:text-right">
          <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">
            Developed by{" "}
            <span className="text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full font-black ml-1">
              Prashant
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
