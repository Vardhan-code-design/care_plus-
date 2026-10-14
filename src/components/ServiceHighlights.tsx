import React from 'react';
import {
  Video,
  Building,
  FileCheck2,
  BellRing,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Clock,
} from 'lucide-react';
import { useCare } from '../context/CareContext';

export const ServiceHighlights: React.FC = () => {
  const { setShowSmartCareModal, setShowPrepAssistantModal } = useCare();

  const services = [
    {
      icon: Video,
      title: '24/7 Virtual Telehealth',
      description:
        'Encrypted high-definition video consultations with top specialists. Instant waiting room admission with digital diagnostic screen-sharing.',
    },
    {
      icon: Building,
      title: 'In-Clinic Hospital Visits',
      description:
        'Guaranteed zero-wait priority appointments at premier affiliated partner hospitals and dedicated outpatient clinic suites.',
    },
    {
      icon: FileCheck2,
      title: 'Digital Health Records',
      description:
        'Secure ISO 27001 compliant cloud repository for lab panels, radiology imaging, and QR-verifiable doctor prescriptions.',
    },
    {
      icon: BellRing,
      title: 'Smart Follow-up Reminders',
      description:
        'Automated appointment alerts, medication regimen timelines, and pre-consultation visit checklists tailored to your symptoms.',
    },
  ];

  return (
    <section id="services" className="py-16 bg-slate-50/60 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
            Clinical Care Highlights
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Healthcare at Every Step
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Care+ unifies discovery, booking, encrypted consultations, and continuous post-visit monitoring on a single platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 border border-sky-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
