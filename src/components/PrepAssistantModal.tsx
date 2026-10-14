import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useCare } from '../context/CareContext';

const DEFAULT_CHECKLIST = [
  { id: 1, text: 'Collect past prescriptions and active medication names', checked: true },
  { id: 2, text: 'Keep recent diagnostic lab reports & imaging scans ready', checked: true },
  { id: 3, text: 'Note down exact date when primary symptoms first began', checked: false },
  { id: 4, text: 'List any known drug allergies (e.g. Penicillin, NSAIDs)', checked: true },
  { id: 5, text: 'Prepare questions about side effects and follow-up timeline', checked: false },
];

export const PrepAssistantModal: React.FC = () => {
  const { showPrepAssistantModal, setShowPrepAssistantModal, currentPatient } = useCare();
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [questions, setQuestions] = useState<string[]>([
    'What is the most probable cause of these symptoms?',
    'Are there dietary or lifestyle changes that can help improve recovery?',
    'What should I monitor, and what are red-flag warning signs?',
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [copied, setCopied] = useState(false);

  if (!showPrepAssistantModal) return null;

  const toggleCheck = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQuestions((prev) => [...prev, newQuestion.trim()]);
    setNewQuestion('');
  };

  const removeQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const copyNotes = () => {
    const text = `Care+ Visit Preparation Notes for ${currentPatient.name}:
CHECKLIST:
${checklist.map((c) => `[${c.checked ? 'X' : ' '}] ${c.text}`).join('\n')}

QUESTIONS FOR DOCTOR:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Appointment Preparation Assistant</h2>
              <p className="text-xs text-slate-500">Maximize the value of your upcoming consultation</p>
            </div>
          </div>
          <button
            onClick={() => setShowPrepAssistantModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Patient Quick Vitals Header */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-900">{currentPatient.name}</span>
              <span className="text-slate-400 mx-1.5">·</span>
              <span>{currentPatient.age} yrs</span>
              <span className="text-slate-400 mx-1.5">·</span>
              <span>Blood Group: {currentPatient.bloodGroup}</span>
            </div>
            <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
              Allergies: {currentPatient.allergies?.join(', ')}
            </span>
          </div>

          {/* Checklist */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Pre-Consultation Checklist
            </h3>
            <div className="space-y-2">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center gap-3 cursor-pointer ${
                    item.checked
                      ? 'bg-sky-50/70 border-sky-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-sky-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className={item.checked ? 'font-medium' : ''}>{item.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Questions for Doctor */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Questions to Ask Your Doctor
            </h3>
            <div className="space-y-2 mb-3">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between gap-2"
                >
                  <span className="text-slate-800 font-medium">
                    {idx + 1}. {q}
                  </span>
                  <button
                    onClick={() => removeQuestion(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddQuestion} className="flex gap-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Add custom question to ask..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={copyNotes}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={() => setShowPrepAssistantModal(false)}
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
