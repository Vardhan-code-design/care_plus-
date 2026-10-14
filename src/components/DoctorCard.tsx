import React, { useState } from 'react';
import {
  Heart,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Building,
  Video,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Doctor } from '../types';
import { useCare } from '../context/CareContext';

interface DoctorCardProps {
  doctor: Doctor;
  onBookClick: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookClick }) => {
  const { favoriteDoctorIds, toggleFavorite } = useCare();
  const [showDetailModal, setShowDetailModal] = useState(false);

  const isFavorite = favoriteDoctorIds.includes(doctor.id);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
        {/* Top Card Body */}
        <div className="p-5">
          {/* Header Row: Avatar, Info, Favorite */}
          <div className="flex items-start gap-4">
            {/* Avatar Frame with fallback */}
            <div className="relative shrink-0">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-slate-100 shadow-xs group-hover:scale-102 transition-transform"
                referrerPolicy="no-referrer"
              />
              {doctor.verificationStatus === 'verified' && (
                <div
                  className="absolute -bottom-1 -right-1 bg-sky-600 text-white rounded-full p-1 shadow-xs"
                  title="Medical Council Verified Practitioner"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Doctor Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-semibold text-sky-700 truncate">
                    {doctor.specialty}
                  </p>
                </div>

                <button
                  onClick={() => toggleFavorite(doctor.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isFavorite
                      ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                  aria-label="Add to favorites"
                  title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Qualifications */}
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {doctor.qualifications}
              </p>

              {/* Experience and Rating */}
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                <span className="font-medium">{doctor.experienceYears} yrs exp.</span>
                <span className="text-slate-300">·</span>
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>{doctor.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({doctor.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital & Location */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 truncate">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{doctor.hospitalAffiliation}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate text-slate-500">{doctor.clinicAddress}</span>
            </div>
          </div>

          {/* Availability & Booking Mode */}
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{doctor.availabilityStatus}</span>
            </div>

            <div className="text-slate-500 text-[11px]">
              {doctor.requiresDoctorApproval ? (
                <span className="text-amber-700 font-medium">Doctor Approval</span>
              ) : (
                <span className="text-sky-700 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-sky-600" />
                  Instant Booking
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Card Footer: Fee & Action */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Consultation Fee
            </span>
            <span className="text-lg font-extrabold text-slate-900 tabular-nums">
              ₹{doctor.fee.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetailModal(true)}
              className="p-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title="View Doctor Details"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={() => onBookClick(doctor)}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Detailed Profile Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
                  <p className="text-xs font-semibold text-sky-700">{doctor.specialty}</p>
                  <p className="text-xs text-slate-500">Reg No: {doctor.registrationNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                Qualifications & Background
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {doctor.qualifications}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {doctor.bio}
              </p>
            </div>

            <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Hospital:</span>
                <span className="font-medium text-slate-900">{doctor.hospitalAffiliation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-medium text-slate-900 text-right">{doctor.clinicAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Available Days:</span>
                <span className="font-medium text-slate-900">{doctor.availableDays.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Slots:</span>
                <span className="font-medium text-slate-900">{doctor.timeSlots.join(' · ')}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-sky-200/60">
                <span className="text-slate-600 font-semibold">Consultation Fee:</span>
                <span className="font-bold text-sky-800 text-sm">₹{doctor.fee}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  onBookClick(doctor);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs"
              >
                Proceed to Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
