import React, { useState } from 'react';
import {
  X,
  HeartPulse,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useCare } from '../context/CareContext';

const SYMPTOM_SCENARIOS = [
  {
    id: 'fever_cough',
    title: 'Fever, Body Aches & Dry Cough',
    specialty: 'General Medicine',
    urgency: 'Routine Outpatient (1-2 days)',
    guide: 'Monitor oral temperature. Stay well hydrated with oral fluids and light meals. If fever persists over 101°F for 3 consecutive days or you experience breathlessness, schedule an immediate consultation with an Internal Medicine specialist.',
    questions: [
      'How many days has the fever been present?',
      'Are you experiencing throat soreness or chills?',
      'Any known exposure to viral infections?',
    ],
  },
  {
    id: 'chest_discomfort',
    title: 'Chest Tightness or Sudden Palpitations',
    specialty: 'Cardiology',
    urgency: 'Emergency / Immediate Evaluation',
    guide: 'If chest pain radiates to left arm, neck, or jaw accompanied by profuse sweating or breathlessness, call 112 / Care+ Emergency Helpline immediately (+91 1800-209-CARE). For non-acute intermittent palpitations, consult a Cardiologist for a 12-lead ECG and Holter monitor.',
    questions: [
      'Does pain increase during physical exertion?',
      'Is there associated shortness of breath?',
      'Do you have a personal or family history of high BP or diabetes?',
    ],
  },
  {
    id: 'skin_allergy',
    title: 'Sudden Skin Rash, Red Patches & Itching',
    specialty: 'Dermatology',
    urgency: 'Consult within 24-48 hours',
    guide: 'Avoid scratching the affected region. Do not apply harsh over-the-counter steroid creams without diagnosis. Keep skin clean and moisturized. Consult a Dermatologist for clinical dermoscopy and patch testing.',
    questions: [
      'Did you start any new medication, food, or skincare product?',
      'Are the patches spreading or blistering?',
      'Any swelling around eyes, lips, or tongue?',
    ],
  },
  {
    id: 'knee_joint',
    title: 'Persistent Knee Pain & Difficulty Walking',
    specialty: 'Orthopedics',
    urgency: 'Elective Outpatient',
    guide: 'Follow R.I.C.E protocol (Rest, Ice for 15 mins, Compression support, Elevation). Avoid heavy weight-bearing or high-impact running until evaluated by an Orthopedic surgeon. Imaging like digital X-ray or MRI may be required.',
    questions: [
      'Was there an acute sports twist or fall injury?',
      'Is there visible joint swelling or morning stiffness?',
      'Does the joint lock or click when bending?',
    ],
  },
];

export const SmartCareGuideModal: React.FC = () => {
  const { showSmartCareModal, setShowSmartCareModal, setSelectedSpecialty, setRole } = useCare();
  const [selectedScenario, setSelectedScenario] = useState(SYMPTOM_SCENARIOS[0]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [analyzedSpecialty, setAnalyzedSpecialty] = useState<string | null>(null);

  if (!showSmartCareModal) return null;

  const handleCustomAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customSymptom.toLowerCase();
    if (query.includes('heart') || query.includes('chest') || query.includes('bp') || query.includes('palpitation')) {
      setAnalyzedSpecialty('Cardiology');
    } else if (query.includes('skin') || query.includes('rash') || query.includes('acne') || query.includes('hair')) {
      setAnalyzedSpecialty('Dermatology');
    } else if (query.includes('bone') || query.includes('joint') || query.includes('knee') || query.includes('fracture')) {
      setAnalyzedSpecialty('Orthopedics');
    } else if (query.includes('child') || query.includes('baby') || query.includes('pediatric')) {
      setAnalyzedSpecialty('Pediatrics');
    } else if (query.includes('headache') || query.includes('migraine') || query.includes('nerve') || query.includes('dizzy')) {
      setAnalyzedSpecialty('Neurology');
    } else if (query.includes('ear') || query.includes('throat') || query.includes('nose') || query.includes('sinus')) {
      setAnalyzedSpecialty('ENT');
    } else if (query.includes('tooth') || query.includes('teeth') || query.includes('gum') || query.includes('dental')) {
      setAnalyzedSpecialty('Dentistry');
    } else if (query.includes('eye') || query.includes('vision') || query.includes('cataract')) {
      setAnalyzedSpecialty('Ophthalmology');
    } else {
      setAnalyzedSpecialty('General Medicine');
    }
  };

  const handleConsultSpecialty = (spec: string) => {
    setSelectedSpecialty(spec);
    setShowSmartCareModal(false);
    setRole('public');
    const el = document.getElementById('find-doctors');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Care+ Smart Care Guide</h2>
              <p className="text-xs text-slate-500">Clinical navigation & symptom triage assistance</p>
            </div>
          </div>
          <button
            onClick={() => setShowSmartCareModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Medical Disclaimer */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-3 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Medical Notice:</strong> This guidance assistant provides general triage navigation and next-step recommendations only. It is <em>not</em> a substitute for clinical diagnosis, professional consultation, or emergency care.
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Symptom Checker Search */}
          <form onSubmit={handleCustomAnalyze} className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Describe your symptoms
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="e.g. sharp knee pain after jogging, persistent dry cough..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl cursor-pointer shrink-0"
              >
                Analyze
              </button>
            </div>

            {analyzedSpecialty && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between text-xs text-sky-900 mt-2">
                <div>
                  Suggested Specialty: <strong className="text-sky-800">{analyzedSpecialty}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleConsultSpecialty(analyzedSpecialty)}
                  className="px-3 py-1 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 cursor-pointer"
                >
                  View Doctors
                </button>
              </div>
            )}
          </form>

          {/* Common Scenarios Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Common Clinical Scenarios
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SYMPTOM_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-medium transition-all cursor-pointer ${
                    selectedScenario.id === sc.id
                      ? 'bg-sky-50 border-sky-500 text-sky-900 ring-1 ring-sky-500'
                      : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="font-bold truncate">{sc.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{sc.specialty}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Scenario Details */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedScenario.title}</h3>
                <span className="text-xs text-sky-700 font-semibold">
                  Recommended Specialty: {selectedScenario.specialty}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {selectedScenario.urgency}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
              {selectedScenario.guide}
            </p>

            <div>
              <p className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                <span>Questions to prepare before your visit:</span>
              </p>
              <ul className="space-y-1 text-xs text-slate-600">
                {selectedScenario.questions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold">·</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleConsultSpecialty(selectedScenario.specialty)}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Find {selectedScenario.specialty} Specialists</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
