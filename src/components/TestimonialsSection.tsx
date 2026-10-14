import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Rohan Deshmukh',
      location: 'Mumbai, Maharashtra',
      doctor: 'Dr. Arvind Sharma (Cardiology)',
      rating: 5,
      comment:
        'Finding an AIIMS-trained cardiologist on such short notice was incredible. The video consultation room was crystal clear, and my digital prescription was accessible immediately in the app.',
      outcome: 'Blood pressure stabilized within 2 weeks of regimen',
    },
    {
      name: 'Pooja Kulkarni',
      location: 'Bengaluru, Karnataka',
      doctor: 'Dr. Priya Nair (Dermatology)',
      rating: 5,
      comment:
        'Dr. Priya evaluated my persistent allergic rash through high-definition photo review and prescribed a gentle treatment. The preparation assistant helped me organize my timeline.',
      outcome: 'Rash completely cleared with zero flare-ups',
    },
    {
      name: 'Harpreet Singh',
      location: 'Chandigarh, Punjab',
      doctor: 'Dr. Vikram Malhotra (Orthopedics)',
      rating: 5,
      comment:
        'Dr. Vikram gave me an honest second opinion on my knee joint pain. He recommended targeted physiotherapy instead of rushing into surgery. Truly ethical healthcare.',
      outcome: 'Full mobility restored without surgical intervention',
    },
  ];

  return (
    <section className="py-16 bg-slate-50/50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
            Real Patient Outcomes
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Over 50,000 Families Across India
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every review is tied to a verified completed consultation on the Care+ platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500">
                    {'★'.repeat(item.rating)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Patient</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-4 italic">
                  "{item.comment}"
                </p>

                <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100 text-[11px] text-sky-900 font-medium mb-4">
                  <strong>Outcome:</strong> {item.outcome}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">{item.name}</p>
                <p className="text-[11px] text-slate-500">{item.location}</p>
                <p className="text-[11px] text-sky-700 font-semibold mt-0.5">
                  Consulted: {item.doctor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
