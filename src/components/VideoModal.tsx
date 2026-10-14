import React, { useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, ShieldCheck, Video, Clock } from 'lucide-react';
import { useCare } from '../context/CareContext';

export const VideoModal: React.FC = () => {
  const { showVideoModal, setShowVideoModal } = useCare();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!showVideoModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-slate-950 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Top bar */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Care+ Virtual Experience & Facility Tour</h3>
              <p className="text-[11px] text-slate-400">Previewing next-generation telehealth & hospital infrastructure</p>
            </div>
          </div>
          <button
            onClick={() => setShowVideoModal(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-16/9 bg-black overflow-hidden flex items-center justify-center group">
          <img
            src="/src/assets/images/care_clinic_modern_1791914439092.jpg"
            alt="Care+ Modern Facility"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isPlaying ? 'scale-105 filter brightness-95' : 'scale-100 filter brightness-75'
            }`}
            referrerPolicy="no-referrer"
          />

          {/* Video Overlay Info */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-white text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">Care+ Apex Heart & Wellness Center</span>
          </div>

          <div className="absolute bottom-16 left-4 right-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 rounded-xl text-white">
            <p className="text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
              Next-Gen Outpatient Care
            </p>
            <h4 className="text-base sm:text-lg font-bold leading-tight">
              Seamless transition between encrypted teleconsultations and multi-specialty hospital visits.
            </h4>
          </div>

          {/* Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-md p-3 px-4 flex items-center justify-between text-white text-xs border-t border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-sky-600 hover:bg-sky-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-slate-400 tabular-nums">01:42 / 03:30</span>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px]">1080p Ultra HD · Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
