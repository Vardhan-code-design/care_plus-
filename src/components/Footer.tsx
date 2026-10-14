import React from 'react';
import { Stethoscope, ShieldCheck, Phone, Mail, MapPin, Code2, Download } from 'lucide-react';
import { useCare } from '../context/CareContext';

export const Footer: React.FC = () => {
  const { setRole, setSelectedSpecialty, setShowFlutterCodeModal } = useCare();

  const handleSpecialtyClick = (name: string) => {
    setSelectedSpecialty(name);
    setRole('public');
    const el = document.getElementById('find-doctors');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand Lockup & Emergency Helpline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Care<span className="text-sky-400">+</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">Your Health. Our Priority.</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Care+ is India's leading digital outpatient network, connecting patients with certified medical specialists for encrypted video consultations and priority in-clinic visits.
            </p>

            <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1 max-w-sm">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <Phone className="w-3.5 h-3.5" />
                <span>24/7 Emergency Helpline: 1800-209-CARE</span>
              </div>
              <p className="text-[11px] text-slate-400">
                For life-threatening cardiac, trauma, or stroke emergencies, call 112 immediately.
              </p>
            </div>
          </div>

          {/* Col 3: Medical Specialties */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Specialties
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'Cardiology',
                'Dermatology',
                'Orthopedics',
                'Pediatrics',
                'Gynecology',
                'Neurology',
                'General Medicine',
              ].map((spec) => (
                <li key={spec}>
                  <button
                    onClick={() => handleSpecialtyClick(spec)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {spec}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Portals & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Care+ Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setRole('patient')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Patient Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRole('doctor')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Doctor Management Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRole('admin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admin & Verification Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowFlutterCodeModal(true)}
                  className="hover:text-sky-400 transition-colors inline-flex items-center gap-1 cursor-pointer font-semibold text-sky-400"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Flutter & Django DRF Source</span>
                </button>
              </li>
              <li>
                <a
                  href="/care_plus_project.zip"
                  download="care_plus_project.zip"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer text-sky-300 font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Project ZIP (2.1 MB)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Medical Standards
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>ISO 27001 Certified Security</span>
              </div>
              <p>NMC Medical Council Practice Guidelines Compliant</p>
              <p>End-to-End Encrypted Teleconsultation Rooms</p>
              <div className="pt-2 text-[11px] text-slate-500">
                <p>Support: support@careplus.health</p>
                <p>Clinic HQ: Connaught Place, New Delhi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Care+ Healthcare Technologies Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Clinical Disclaimer</span>
            <span>HIPAA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
