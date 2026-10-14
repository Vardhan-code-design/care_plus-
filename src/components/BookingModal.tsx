import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Doctor } from '../types';
import { useCare } from '../context/CareContext';

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose, onSuccess }) => {
  const { currentPatient, bookAppointment, appointments, setRole } = useCare();

  // Next 7 days generator
  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      dates.push({ iso, weekday, dayNum, month });
    }
    return dates;
  };

  const upcomingDates = getUpcomingDates();
  const [selectedDate, setSelectedDate] = useState<string>(upcomingDates[0].iso);
  const [selectedSlot, setSelectedSlot] = useState<string>(doctor.timeSlots[0] || '10:00 AM');
  const [consultationType, setConsultationType] = useState<'video' | 'in_clinic'>('video');
  const [reason, setReason] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<{
    status: 'pending' | 'confirmed';
    message: string;
    appointmentId: string;
  } | null>(null);

  // Check if a slot on selectedDate is already booked
  const isSlotBooked = (slot: string) => {
    return appointments.some(
      (a) =>
        a.doctorId === doctor.id &&
        a.date === selectedDate &&
        a.timeSlot === slot &&
        a.status !== 'cancelled' &&
        a.status !== 'rejected'
    );
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!reason.trim()) {
      setErrorMsg('Please specify the primary reason for your consultation.');
      return;
    }

    const res = bookAppointment({
      doctorId: doctor.id,
      date: selectedDate,
      timeSlot: selectedSlot,
      type: consultationType,
      reason,
      symptoms,
    });

    if (!res.success) {
      setErrorMsg(res.message);
    } else if (res.appointment) {
      setBookingSuccess({
        status: res.appointment.status as 'pending' | 'confirmed',
        message: res.message,
        appointmentId: res.appointment.id,
      });
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Book Consultation with {doctor.name}
              </h2>
              <p className="text-xs text-sky-700 font-semibold">{doctor.specialty} · ₹{doctor.fee}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {bookingSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              {bookingSuccess.status === 'confirmed'
                ? 'Appointment Instantly Confirmed!'
                : 'Appointment Request Submitted!'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {bookingSuccess.message}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-semibold text-slate-900">{doctor.name} ({doctor.specialty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-semibold text-slate-900">{selectedDate} at {selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mode:</span>
                <span className="font-semibold text-sky-700">
                  {consultationType === 'video' ? 'Encrypted Video Consultation' : 'In-Clinic Hospital Visit'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-900">{currentPatient.name}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Status:</span>
                <span
                  className={`font-bold ${
                    bookingSuccess.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {bookingSuccess.status === 'confirmed' ? 'CONFIRMED' : 'PENDING DOCTOR APPROVAL'}
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  setRole('patient');
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs"
              >
                Go to Patient Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-5 sm:p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Consultation Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Consultation Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationType('video')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    consultationType === 'video'
                      ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-600'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      consultationType === 'video' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Video Consultation</p>
                    <p className="text-[11px] text-slate-500">Encrypted online room</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('in_clinic')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    consultationType === 'in_clinic'
                      ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-600'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      consultationType === 'in_clinic'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">In-Clinic Visit</p>
                    <p className="text-[11px] text-slate-500">Visit doctor's hospital</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Date Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Choose Consultation Date
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {upcomingDates.map((d) => {
                  const isSelected = selectedDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDate(d.iso)}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-80">
                        {d.weekday}
                      </span>
                      <span className="text-base font-extrabold block my-0.5">
                        {d.dayNum}
                      </span>
                      <span className="text-[10px] block opacity-80">
                        {d.month}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Slot Selection with Backend Duplicate Check */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Available Time Slots
                </label>
                <span className="text-[11px] text-slate-400">
                  {doctor.requiresDoctorApproval ? 'Doctor Approval Required' : 'Instant Booking Eligible'}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {doctor.timeSlots.map((slot) => {
                  const booked = isSlotBooked(slot);
                  const isSelected = selectedSlot === slot && !booked;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={booked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                        booked
                          ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs cursor-pointer'
                          : 'bg-white hover:bg-sky-50 text-slate-700 border-slate-200 hover:border-sky-300 cursor-pointer'
                      }`}
                      title={booked ? 'Slot already reserved by another patient' : `Select ${slot}`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Reason & Symptoms */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  4. Reason for Visit *
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Follow-up for chest tightness, second opinion, skin acne"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Symptoms & Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Mention duration, severity, or current medications..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            {/* Patient Info Banner */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>
                  Booking for: <strong className="text-slate-800">{currentPatient.name}</strong> ({currentPatient.phone})
                </span>
              </div>
              <span className="font-bold text-slate-900 text-sm">Fee: ₹{doctor.fee}</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Reserve Slot</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
