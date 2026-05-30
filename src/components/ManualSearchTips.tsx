import React from "react";
import { Search, Globe, ShieldCheck, Heart } from "lucide-react";

export default function ManualSearchTips() {
  return (
    <div className="bg-white/5 backdrop-blur-[24px] p-5 rounded-3xl border border-white/10 space-y-3.5 my-4 shadow-lg shadow-black/20">
      <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs select-none">
        <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span>Sri Lanka Social Search Guidelines</span>
      </div>

      <p className="text-[11px] text-slate-300 leading-relaxed opacity-90">
        Private profile details remain protected under digital safety laws. If a person is not a public figure, here are effective tips to locate active profiles legally:
      </p>

      <div className="grid grid-cols-1 gap-2.5">
        <div className="flex items-start gap-2.5 p-3 bg-white/[0.03] backdrop-blur rounded-2xl border border-white/5">
          <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 flex-shrink-0 mt-0.5">
            <Search className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="text-left">
            <h4 className="text-[11px] font-bold text-slate-100">Refine Name Searches</h4>
            <p className="text-[10px] text-slate-300 opacity-80 leading-normal mt-0.5">
              Sri Lankan names are often multi-part. Switch between first name + surname or initials (e.g., K. Sangakkara vs Kumar Sangakkara).
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-white/[0.03] backdrop-blur rounded-2xl border border-white/5">
          <div className="p-1.5 rounded-xl bg-violet-500/10 text-violet-400 flex-shrink-0 mt-0.5">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <h4 className="text-[11px] font-bold text-slate-100">Location Grounding</h4>
            <p className="text-[10px] text-slate-300 opacity-80 leading-normal mt-0.5">
              Append specific towns, campuses, or job domains (e.g., "Colombo", "Moratuwa University", "Sri Lankan Airlines") alongside the name.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-white/[0.03] backdrop-blur rounded-2xl border border-white/5">
          <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 flex-shrink-0 mt-0.5">
            <Heart className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <h4 className="text-[11px] font-bold text-slate-100">Responsible Search</h4>
            <p className="text-[10px] text-slate-300 opacity-80 leading-normal mt-0.5">
              Never use found profiles for online harassment or spamming. Respect individual personal privacy rights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
