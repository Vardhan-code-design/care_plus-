import React from 'react';
import {
  Search,
  Play,
  ShieldCheck,
  Video,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  HeartPulse,
  Users,
  Award,
} from 'lucide-react';
import { useCare } from '../context/CareContext';

interface HeroProps {
  onFindDoctorClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onFindDoctorClick }) => {
  const { setShowVideoModal, setShowSmartCareModal, setShowPrepAssistantModal } = useCare();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50/40 pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-slate-200/60">
      {/* Decorative background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Proposition, Value, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Clean kicker text */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-800 bg-sky-100/80 px-3 py-1.5 rounded-full border border-sky-200/80">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Transforming Outpatient Healthcare in India</span>
              <span className="text-sky-300">·</span>
              <span className="text-sky-600 font-bold">Care+ Ecosystem</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] text-balance">
              Find the Right Doctor <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700">
                For a Healthier Tomorrow
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Connect with top verified doctors across 10+ specialties. Schedule instant in-clinic consultations or join encrypted HD video appointments with zero waiting time.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onFindDoctorClick}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl shadow-md shadow-sky-600/25 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Search className="w-4 h-4" />
                <span>Find a Doctor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setShowVideoModal(true)}
                className="px-5 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-sky-600 ml-0.5" />
                </div>
                <span>Watch Clinic Tour</span>
              </button>
            </div>

            {/* Feature quick links */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <button
                onClick={() => setShowSmartCareModal(true)}
                className="inline-flex items-center gap-1.5 hover:text-sky-700 font-medium cursor-pointer transition-colors"
              >
                <HeartPulse className="w-4 h-4 text-sky-600" />
                <span>Smart Care Guide</span>
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => setShowPrepAssistantModal(true)}
                className="inline-flex items-center gap-1.5 hover:text-sky-700 font-medium cursor-pointer transition-colors"
              >
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Visit Preparation Assistant</span>
              </button>
              <span className="text-slate-300">·</span>
              <div className="inline-flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Verified Credentials</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Doctor Image with Floating Cards */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Doctor Portrait Frame */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-sky-900/10 bg-gradient-to-b from-sky-100 to-sky-50 aspect-4/3 sm:aspect-4/3 lg:aspect-4/3">
                <img
                  src="/src/assets/images/care_doctor_hero_1791914439149.jpg"
                  alt="Care+ Verified Healthcare Doctor"
                  className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
                
                {/* Embedded overlay tag */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-white/60 shadow-md flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Dr. Arvind Sharma</p>
                    <p className="text-[11px] text-slate-600">Senior Cardiologist · AIIMS Alum</p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Available Today
                  </span>
                </div>
              </div>

              {/* Floating Card 1: Top Right - Rating */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce [animation-duration:4s]">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-slate-900">4.9 / 5.0</span>
                    <span className="text-xs text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-[11px] text-slate-500">12,000+ Verified Reviews</p>
                </div>
              </div>

              {/* Floating Card 2: Bottom Left - 24/7 Telehealth */}
              <div className="absolute -bottom-5 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Instant Video Consult</p>
                  <p className="text-[11px] text-slate-500">Connect in under 15 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Healthcare Statistics Strip (Below Hero Split) */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-sky-200 transition-colors">
            <div className="flex items-center justify-center mb-1 text-sky-600">
              <Users className="w-5 h-5 mr-1.5" />
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                50,000+
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600">Patients Treated Safely</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-sky-200 transition-colors">
            <div className="flex items-center justify-center mb-1 text-blue-600">
              <Award className="w-5 h-5 mr-1.5" />
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                250+
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600">Verified Medical Specialists</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-sky-200 transition-colors">
            <div className="flex items-center justify-center mb-1 text-emerald-600">
              <ShieldCheck className="w-5 h-5 mr-1.5" />
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                98.4%
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600">Satisfaction & Recovery Rate</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-sky-200 transition-colors">
            <div className="flex items-center justify-center mb-1 text-indigo-600">
              <HeartPulse className="w-5 h-5 mr-1.5" />
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                10
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600">Core Medical Specialties</p>
          </div>
        </div>
      </div>
    </section>
  );
};
