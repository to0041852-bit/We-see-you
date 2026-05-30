import React, { useState, useEffect } from "react";
import { Signal, Wifi, Battery, AlertTriangle } from "lucide-react";

interface AndroidFrameProps {
  children: React.ReactNode;
}

export default function AndroidFrame({ children }: AndroidFrameProps) {
  const [time, setTime] = useState("");

  // Live ticking clock for Android Status Bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // safety for midnight state
      const minutesStr = minutes < 10 ? "0" + minutes : minutes;
      setTime(`${hours}:${minutesStr} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900/40 p-0 sm:p-6 md:p-8 font-sans transition-all selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Outer Phone Mockup Frame (Hidden on smallest mobile screens to be responsive) */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[100dvh] sm:h-[840px] sm:rounded-[40px] sm:border-8 sm:border-slate-800 sm:bg-slate-950 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] sm:outline sm:outline-4 sm:outline-slate-700/50 flex flex-col overflow-hidden transition-all">
        
        {/* Dynamic Island / Front Camera Notch (Desktop Mockup only) */}
        <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-full z-50 items-center justify-center">
          <div className="w-3 h-3 bg-zinc-900 rounded-full border border-zinc-800 absolute right-4"></div>
          <div className="w-1.5 h-1.5 bg-sky-900 rounded-full opacity-60 absolute right-4.5"></div>
        </div>

        {/* Android Real-time Status Bar */}
        <div className="w-full h-10 bg-black/40 text-slate-200 px-6 pt-2 flex justify-between items-center text-xs font-semibold tracking-wider select-none z-40 border-b border-white/5 backdrop-blur-sm">
          {/* Active Time */}
          <span className="sm:pl-1">{time || "08:32 AM"}</span>
          
          {/* Center Space for Notch */}
          <div className="hidden sm:block w-32"></div>

          {/* Device Signals */}
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[10px] scale-90 opacity-90">5G</span>
            <div className="flex items-center gap-0.5 ml-1">
              <span className="text-[10px] scale-90">SRI</span>
              <Battery className="w-4 h-4 text-indigo-400 rotate-90 origin-center" />
            </div>
          </div>
        </div>

        {/* Android Active View Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#312e81] relative flex flex-col scrollbar-thin">
          {children}
        </div>

        {/* Android Gesture Navigation Pill */}
        <div className="w-full h-5 bg-slate-950 flex items-center justify-center select-none z-40 py-1">
          <div className="w-28 h-1 bg-zinc-600 rounded-full"></div>
        </div>

      </div>
    </div>
  );
}
