import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Users,
  Calendar,
  Star,
  FileText,
  Activity,
  History,
  TrendingUp,
  Search,
  Filter,
  Check,
  Trash2,
  Eye,
  Lock,
} from 'lucide-react';
import { useCare } from '../context/CareContext';
import { Doctor } from '../types';

export const AdminPortal: React.FC = () => {
  const {
    doctors,
    appointments,
    reviews,
    auditLogs,
    verifyDoctor,
    moderateReview,
    cancelAppointment,
    currentPatient,
  } = useCare();

  const [activeTab, setActiveTab] = useState<'verification' | 'analytics' | 'appointments' | 'reviews' | 'audit'>('verification');
  const [searchDoctorQuery, setSearchDoctorQuery] = useState('');
  const [selectedAuditFilter, setSelectedAuditFilter] = useState<string>('all');

  const pendingDoctors = doctors.filter((d) => d.verificationStatus === 'pending');
  const verifiedDoctors = doctors.filter((d) => d.verificationStatus === 'verified');

  // Analytics metrics
  const totalBookings = appointments.length;
  const confirmedBookings = appointments.filter((a) => a.status === 'confirmed').length;
  const completedBookings = appointments.filter((a) => a.status === 'completed').length;
  const cancelledBookings = appointments.filter((a) => a.status === 'cancelled').length;
  const totalRevenueINR = appointments
    .filter((a) => a.status === 'confirmed' || a.status === 'completed')
    .reduce((acc, curr) => acc + curr.fee, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Admin Header */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-sky-900/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Care+ Platform Administration
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Medical compliance, practitioner credential verification, disputes & audit monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
              Session: <strong className="text-white">Encrypted / ISO 27001</strong>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 w-fit overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'verification' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Doctor Verification</span>
            {pendingDoctors.length > 0 && (
              <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-md">
                {pendingDoctors.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Platform Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'appointments' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>All Bookings & Disputes</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reviews' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Review Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Tab 1: Doctor Credentials Verification Queue */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Medical Practitioner Verification Queue
                  </h2>
                  <p className="text-xs text-slate-400">
                    Verify Medical Council certificates, clinical licenses, and hospital appointments before doctors go live.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-900 px-3 py-1 rounded-full">
                  {pendingDoctors.length} Awaiting Review
                </span>
              </div>

              {pendingDoctors.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-xs text-slate-400">
                  All practitioner registrations are currently verified!
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{doc.name}</span>
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                              Registration Pending
                            </span>
                          </div>
                          <p className="text-sky-400 font-semibold">{doc.specialty}</p>
                          <p className="text-slate-300">
                            <strong>Qualifications:</strong> {doc.qualifications}
                          </p>
                          <p className="text-slate-400">
                            <strong>Medical Registration No:</strong>{' '}
                            <span className="font-mono text-amber-300">{doc.registrationNumber}</span> ·{' '}
                            {doc.experienceYears} yrs experience · Fee: ₹{doc.fee}
                          </p>
                          <p className="text-slate-400 italic">Hospital: {doc.hospitalAffiliation}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => verifyDoctor(doc.id, 'rejected')}
                          className="px-4 py-2 text-rose-400 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => verifyDoctor(doc.id, 'verified')}
                          className="px-5 py-2 text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify & Approve</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* List of Already Verified Doctors */}
            <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Active Verified Doctors ({verifiedDoctors.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {verifiedDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-white">{doc.name}</p>
                      <p className="text-sky-400 text-[11px]">{doc.specialty}</p>
                      <p className="text-slate-500 text-[10px]">Reg: {doc.registrationNumber}</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Platform Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                  Total Bookings
                </span>
                <span className="text-3xl font-extrabold text-white mt-1 block tabular-nums">
                  {totalBookings}
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 block">+18% this month</span>
              </div>

              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                  Active Verified Doctors
                </span>
                <span className="text-3xl font-extrabold text-sky-400 mt-1 block tabular-nums">
                  {verifiedDoctors.length}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Across 10 Specialties</span>
              </div>

              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                  Completed Consults
                </span>
                <span className="text-3xl font-extrabold text-emerald-400 mt-1 block tabular-nums">
                  {completedBookings}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">0 Unresolved Disputes</span>
              </div>

              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                  Gross Platform Volume
                </span>
                <span className="text-3xl font-extrabold text-amber-400 mt-1 block tabular-nums">
                  ₹{totalRevenueINR.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Transparent fee settlement</span>
              </div>
            </div>

            {/* Specialty Booking Breakdown */}
            <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Specialty Patient Demand</h3>
              <div className="space-y-2 text-xs">
                {['Cardiology', 'General Medicine', 'Dermatology', 'Pediatrics', 'Orthopedics'].map(
                  (spec, idx) => (
                    <div key={spec} className="space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>{spec}</span>
                        <span className="font-mono text-slate-400">
                          {idx === 0 ? '38%' : idx === 1 ? '26%' : idx === 2 ? '18%' : '9%'} volume
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
                          style={{
                            width: idx === 0 ? '38%' : idx === 1 ? '26%' : idx === 2 ? '18%' : '9%',
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Appointments & Booking Dispute Management */}
        {activeTab === 'appointments' && (
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Platform Appointment Management & Booking Disputes
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time visibility into all bookings across patients and specialists
                </p>
              </div>
              <span className="text-xs text-slate-400">{appointments.length} Total Records</span>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{apt.patientName}</span>
                      <span className="text-slate-500">&rarr;</span>
                      <span className="font-bold text-sky-400">{apt.doctorName}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : apt.status === 'pending'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : apt.status === 'completed'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-1">
                      Date: <span className="text-white">{apt.date}</span> at{' '}
                      <span className="text-white">{apt.timeSlot}</span> · Fee: ₹{apt.fee} · Type:{' '}
                      {apt.type}
                    </p>
                    <p className="text-slate-300 mt-0.5">Reason: {apt.reason}</p>
                  </div>

                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="px-3 py-1.5 text-xs text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 rounded-xl font-medium cursor-pointer self-end md:self-center"
                    >
                      Administrative Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Review Moderation */}
        {activeTab === 'reviews' && (
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Patient Review & Testimonial Moderation
              </h2>
              <p className="text-xs text-slate-400">
                Preserve legitimate clinical feedback while moderating abusive or violating submissions
              </p>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{rev.patientName}</span>
                      <span className="text-slate-500">reviewing doctor ID: {rev.doctorId}</span>
                      <span className="text-amber-400 font-bold">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          rev.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-rose-950 text-rose-400'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </div>
                    <p className="text-slate-300 italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-500">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {rev.status !== 'approved' ? (
                      <button
                        onClick={() => moderateReview(rev.id, 'approved')}
                        className="px-3 py-1.5 text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-xl cursor-pointer"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => moderateReview(rev.id, 'flagged')}
                        className="px-3 py-1.5 text-xs text-rose-400 bg-rose-950 border border-rose-800 rounded-xl cursor-pointer"
                      >
                        Flag Inappropriate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Audit Log Trail */}
        {activeTab === 'audit' && (
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Administrative & Healthcare Audit Trail
                </h2>
                <p className="text-xs text-slate-400">
                  Immutable log of credentials verified, bookings made, cancellations, and profile adjustments
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">{auditLogs.length} Events Logged</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-sky-400">
                      <span className="text-slate-500 font-mono text-[11px]">{log.timestamp}</span>
                      <span className="text-xs font-bold text-sky-300">[{log.action}]</span>
                      <span className="text-slate-400 text-[11px]">by {log.actorName}</span>
                    </div>
                    <p className="text-slate-300 font-sans text-xs">{log.details}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{log.target}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
