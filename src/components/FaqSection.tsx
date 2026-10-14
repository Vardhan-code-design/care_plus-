import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the difference between Instant Booking and Doctor Approval?',
      a: 'Doctors on Care+ choose their scheduling preference. Under Instant Booking, your slot is locked and confirmed immediately if available. For Approval Booking, the doctor reviews your consultation reason and preliminary notes to ensure optimal clinical alignment before confirming.',
    },
    {
      q: 'How does Care+ prevent overlapping doctor appointments?',
      a: 'Our backend enforces strict slot validation locks. When a patient initiates or confirms a booking for a specific doctor, date, and time slot, that slot is instantly unavailable to all other patients across the platform.',
    },
    {
      q: 'How can I reschedule or cancel an existing appointment?',
      a: 'Patients can reschedule or cancel an upcoming consultation directly from the Patient Portal dashboard. Rescheduling checks slot availability in real time and updates both the patient and doctor calendars.',
    },
    {
      q: 'Are my medical records kept confidential from other practitioners?',
      a: 'Yes. Care+ adheres to strict role-based access control (RBAC). A doctor can only access health records, diagnostic tests, and past prescriptions of patients who have active or completed appointments with them. Doctors cannot view records of unrelated platform patients.',
    },
    {
      q: 'How are consultation fees handled and displayed?',
      a: 'All consultation fees are displayed transparently in Indian Rupees (₹) upfront on doctor profiles with zero hidden service charges. Fees cover full consultation, clinical notes, and digital prescriptions.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Everything you need to know about bookings, teleconsultations, and security on Care+.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-sky-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 bg-slate-50/60 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
