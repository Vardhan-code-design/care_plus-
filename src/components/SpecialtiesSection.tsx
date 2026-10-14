import React from 'react';
import {
  HeartPulse,
  Sparkles,
  Bone,
  Baby,
  ActivitySquare,
  Brain,
  Stethoscope,
  Ear,
  Smile,
  Eye,
  Check,
} from 'lucide-react';
import { INITIAL_SPECIALTIES } from '../data/initialData';
import { useCare } from '../context/CareContext';

const ICON_MAP: Record<string, React.ElementType> = {
  HeartPulse,
  Sparkles,
  Bone,
  Baby,
  ActivitySquare,
  Brain,
  Stethoscope,
  Ear,
  Smile,
  Eye,
};

interface SpecialtiesSectionProps {
  onSpecialtySelected?: () => void;
}

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({ onSpecialtySelected }) => {
  const { selectedSpecialty, setSelectedSpecialty, doctors } = useCare();

  const handleSpecialtyClick = (specialtyName: string) => {
    if (selectedSpecialty === specialtyName) {
      setSelectedSpecialty(null); // toggle off
    } else {
      setSelectedSpecialty(specialtyName);
      if (onSpecialtySelected) {
        onSpecialtySelected();
      }
    }
  };

  return (
    <section id="specialties" className="py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold text-sky-700 tracking-wider uppercase mb-1">
              Clinical Specializations
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore Medical Specialties
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Tap any specialty to instantly filter verified specialists available for in-clinic or video consultation.
            </p>
          </div>

          {selectedSpecialty && (
            <button
              onClick={() => setSelectedSpecialty(null)}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              Clear Filter ({selectedSpecialty})
            </button>
          )}
        </div>

        {/* 10 Specialties Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {INITIAL_SPECIALTIES.map((spec) => {
            const Icon = ICON_MAP[spec.iconName] || Stethoscope;
            const isSelected = selectedSpecialty === spec.name;
            const actualCount = doctors.filter((d) => d.specialty === spec.name).length;

            return (
              <button
                key={spec.id}
                onClick={() => handleSpecialtyClick(spec.name)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50/90 border-sky-500 shadow-sm ring-2 ring-sky-500/20'
                    : 'bg-slate-50/60 hover:bg-white border-slate-200 hover:border-sky-300 hover:shadow-xs'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}

                <div>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white text-sky-600 border border-slate-200 group-hover:border-sky-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3
                    className={`text-sm font-bold tracking-tight mb-1 ${
                      isSelected ? 'text-sky-950' : 'text-slate-900 group-hover:text-sky-900'
                    }`}
                  >
                    {spec.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {spec.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{actualCount > 0 ? `${actualCount} Doctors Available` : `${spec.doctorCount}+ Specialists`}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
