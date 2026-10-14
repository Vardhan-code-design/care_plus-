import React from 'react';
import { Search, CalendarCheck, Stethoscope, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC<{ onFindDoctorClick: () => void }> = ({ onFindDoctorClick }) => {
  const steps = [
    {
      num: '01',
      title: 'Discover Verified Specialists',
      desc: 'Browse certified doctors across 10 specialties. Inspect qualifications, patient ratings, hospital affiliations, and transparent consultation fees.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Reserve Instant or Approval Slot',
      desc: 'Choose your preferred date and time. Our backend validates slot availability in real time to prevent double-booking.',
      icon: CalendarCheck,
    },
    {
      num: '03',
      title: 'Consult & Receive Care Plans',
      desc: 'Connect via encrypted HD video or visit the clinic. Receive digital prescriptions, diagnostic notes, and automated reminders.',
      icon: Stethoscope,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
            Simplified Patient Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Care+ Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Seamless care orchestration from initial symptom discovery to verified prescription fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 p-6 sm:p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-sky-700 font-mono">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center text-xs font-semibold text-sky-700">
                  <span>Step {idx + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onFindDoctorClick}
            className="px-6 py-3 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>Book Your Consultation Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
