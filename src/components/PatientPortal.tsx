import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Upload,
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Plus,
  HeartPulse,
  Download,
  Eye,
  Trash2,
  Share2,
  RefreshCw,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { useCare } from '../context/CareContext';
import { Appointment, HealthRecord } from '../types';

export const PatientPortal: React.FC = () => {
  const {
    currentPatient,
    appointments,
    healthRecords,
    cancelAppointment,
    rescheduleAppointment,
    uploadHealthRecord,
    submitReview,
    setVideoAppointment,
    setShowSmartCareModal,
    setShowPrepAssistantModal,
    setRole,
    setBookingDoctor,
    doctors,
  } = useCare();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'records' | 'reviews'>('dashboard');
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed'>('all');

  // Reschedule state
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [rescheduleMsg, setRescheduleMsg] = useState<string | null>(null);

  // Health record upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [recordTitle, setRecordTitle] = useState('');
  const [recordCategory, setRecordCategory] = useState<HealthRecord['category']>('Lab Report');
  const [recordSummary, setRecordSummary] = useState('');
  const [selectedFileMock, setSelectedFileMock] = useState('blood_lipid_panel_oct.pdf');

  // Review submission state
  const [reviewingApt, setReviewingApt] = useState<Appointment | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState(false);

  // Filter patient's appointments
  const patientAppointments = appointments.filter((a) => a.patientId === currentPatient.id);
  const upcomingAppointments = patientAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );
  const completedAppointments = patientAppointments.filter((a) => a.status === 'completed');

  const filteredAppointments = patientAppointments.filter((a) => {
    if (appointmentFilter === 'all') return true;
    return a.status === appointmentFilter;
  });

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingApt || !newDate || !newSlot) return;
    const res = rescheduleAppointment(reschedulingApt.id, newDate, newSlot);
    if (res.success) {
      setRescheduleMsg('Appointment rescheduled successfully!');
      setTimeout(() => {
        setReschedulingApt(null);
        setRescheduleMsg(null);
      }, 1500);
    } else {
      setRescheduleMsg(res.message);
    }
  };

  const handleUploadRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordTitle.trim()) return;

    uploadHealthRecord({
      title: recordTitle.trim(),
      category: recordCategory,
      summary: recordSummary.trim() || 'Patient uploaded medical record document.',
      fileSize: '1.2 MB',
      fileType: 'PDF',
    });

    setShowUploadModal(false);
    setRecordTitle('');
    setRecordSummary('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingApt) return;
    submitReview(reviewingApt.id, reviewingApt.doctorId, reviewRating, reviewComment);
    setReviewSubmittedMsg(true);
    setTimeout(() => {
      setReviewingApt(null);
      setReviewSubmittedMsg(false);
      setReviewComment('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Welcome Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-sky-600/20">
              {currentPatient.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Welcome back, {currentPatient.name}
                </h1>
                <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
                  Patient Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentPatient.phone} · Blood Group: {currentPatient.bloodGroup} · Allergies:{' '}
                {currentPatient.allergies?.join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowSmartCareModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Smart Care Guide</span>
            </button>

            <button
              onClick={() => setShowPrepAssistantModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Visit Prep Assistant</span>
            </button>

            <button
              onClick={() => setRole('public')}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Book New Doctor</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Appointments</span>
            <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded-md font-bold">
              {patientAppointments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'records'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Digital Health Records</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-md font-bold">
              {healthRecords.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Upcoming Appointments */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <span>Upcoming Consultations</span>
                  </h2>
                  <span className="text-xs font-medium text-slate-500">
                    {upcomingAppointments.length} Scheduled
                  </span>
                </div>

                {upcomingAppointments.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-medium">No upcoming appointments scheduled.</p>
                    <button
                      onClick={() => setRole('public')}
                      className="mt-3 text-xs font-semibold text-sky-600 hover:text-sky-700"
                    >
                      Find and book a doctor &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-sky-300 bg-white shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <img
                            src={apt.doctorAvatar}
                            alt={apt.doctorName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-bold text-slate-900">{apt.doctorName}</h3>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  apt.status === 'confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {apt.status === 'confirmed' ? 'Confirmed' : 'Pending Approval'}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-sky-700 mt-0.5">
                              {apt.doctorSpecialty}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                              <span className="flex items-center gap-1 font-medium text-slate-700">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {apt.date}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1 font-medium text-slate-700">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {apt.timeSlot}
                              </span>
                              <span>·</span>
                              <span className="text-slate-600">
                                {apt.type === 'video' ? 'Video Consult' : 'In-Clinic'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-2 line-clamp-1 italic">
                              "{apt.reason}"
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {apt.type === 'video' && apt.status === 'confirmed' && (
                            <button
                              onClick={() => setVideoAppointment(apt)}
                              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Video Call</span>
                            </button>
                          )}

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setReschedulingApt(apt);
                                setNewDate(apt.date);
                                setNewSlot(apt.timeSlot);
                              }}
                              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => cancelAppointment(apt.id)}
                              className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Health Records Strip */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>Recent Medical Records & Prescriptions</span>
                  </h2>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {healthRecords.slice(0, 3).map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sky-700 font-bold shrink-0">
                          {rec.fileType}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{rec.title}</p>
                          <p className="text-slate-500 mt-0.5">
                            {rec.category} · {rec.date} · {rec.fileSize}
                            {rec.doctorName && ` · Issued by ${rec.doctorName}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Viewing document: ${rec.title}\n\nSummary: ${rec.summary}`)}
                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="Preview document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Quick Care Shortcuts & Reminders */}
            <div className="lg:col-span-4 space-y-6">
              {/* Care Reminders */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-3xl p-6 border border-sky-100 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>Care+ Smart Reminders</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white/90 rounded-2xl border border-sky-100 shadow-xs space-y-1">
                    <span className="font-bold text-sky-900 block">Preparation Checklist</span>
                    <p className="text-slate-600">
                      Keep your recent lipid panel ready before Dr. Arvind Sharma's follow-up video call.
                    </p>
                  </div>

                  <div className="p-3 bg-white/90 rounded-2xl border border-sky-100 shadow-xs space-y-1">
                    <span className="font-bold text-slate-900 block">Prescription Refill</span>
                    <p className="text-slate-600">
                      Paracetamol 650mg course completed on Oct 08. Review feedback with Dr. Sunil Varma.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPrepAssistantModal(true)}
                  className="w-full py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Open Preparation Assistant
                </button>
              </div>

              {/* Review Eligible Completed Consultations */}
              {completedAppointments.some((a) => !a.hasReviewed) && (
                <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Leave Feedback</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    You have a completed consultation eligible for review. Your feedback helps other patients choose the right care.
                  </p>
                  {completedAppointments
                    .filter((a) => !a.hasReviewed)
                    .map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => setReviewingApt(apt)}
                        className="w-full p-3 text-left rounded-xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100/60 transition-colors text-xs font-semibold text-slate-900 flex items-center justify-between cursor-pointer"
                      >
                        <span>Rate {apt.doctorName}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: All Appointments */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Appointment History & Tracking</h2>
                <p className="text-xs text-slate-500">
                  Track pending requests, confirmed bookings, and completed consultations
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                {(['all', 'confirmed', 'pending', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setAppointmentFilter(f)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                      appointmentFilter === f ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3.5">
              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No appointments found for filter "{appointmentFilter}".
                </div>
              ) : (
                filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={apt.doctorAvatar}
                        alt={apt.doctorName}
                        className="w-12 h-12 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{apt.doctorName}</h3>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : apt.status === 'pending'
                                ? 'bg-amber-50 text-amber-700'
                                : apt.status === 'completed'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-sky-700 font-semibold">{apt.doctorSpecialty}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Date: <strong className="text-slate-800">{apt.date}</strong> at{' '}
                          <strong className="text-slate-800">{apt.timeSlot}</strong> · Mode:{' '}
                          {apt.type === 'video' ? 'Video Call' : 'In-Clinic'} · Fee: ₹{apt.fee}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          <strong>Reason:</strong> {apt.reason}
                        </p>
                        {apt.consultationNotes && (
                          <div className="mt-2 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                            <strong>Doctor's Notes:</strong> {apt.consultationNotes}
                          </div>
                        )}
                        {apt.prescription && (
                          <div className="mt-2 p-2.5 bg-sky-50/70 rounded-xl text-xs text-sky-950 border border-sky-100">
                            <strong>Prescription Issued:</strong>
                            <pre className="whitespace-pre-wrap font-sans mt-0.5 text-xs text-slate-700">
                              {apt.prescription}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {apt.type === 'video' && apt.status === 'confirmed' && (
                        <button
                          onClick={() => setVideoAppointment(apt)}
                          className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Video</span>
                        </button>
                      )}

                      {apt.status === 'completed' && !apt.hasReviewed && (
                        <button
                          onClick={() => setReviewingApt(apt)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Leave Review</span>
                        </button>
                      )}

                      {(apt.status === 'confirmed' || apt.status === 'pending') && (
                        <>
                          <button
                            onClick={() => {
                              setReschedulingApt(apt);
                              setNewDate(apt.date);
                              setNewSlot(apt.timeSlot);
                            }}
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => cancelAppointment(apt.id)}
                            className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Digital Health Records */}
        {activeTab === 'records' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Encrypted Digital Health Records</h2>
                <p className="text-xs text-slate-500">
                  Securely stored lab reports, imaging scans, and prescriptions
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Medical Record</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-md">
                        {rec.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{rec.date}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">{rec.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {rec.summary}
                    </p>
                    {rec.doctorName && (
                      <p className="text-[11px] text-slate-500 italic mb-2">
                        Issued by: {rec.doctorName}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{rec.fileType} · {rec.fileSize}</span>
                    <button
                      onClick={() => alert(`Accessing file: ${rec.title}\nProtected Cloud Storage link generated.`)}
                      className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Health Record Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload Digital Health Record</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadRecord} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={recordTitle}
                  onChange={(e) => setRecordTitle(e.target.value)}
                  placeholder="e.g. Thyroid Profile Serum Test, Chest X-Ray"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={recordCategory}
                  onChange={(e) => setRecordCategory(e.target.value as HealthRecord['category'])}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="Lab Report">Lab Report</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Imaging">Imaging / Scans</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Vaccination">Vaccination Record</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Summary / Notes</label>
                <textarea
                  rows={2}
                  value={recordSummary}
                  onChange={(e) => setRecordSummary(e.target.value)}
                  placeholder="Key diagnostic findings or physician instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-slate-600 font-medium truncate max-w-[200px]">
                  {selectedFileMock}
                </span>
                <span className="text-sky-700 font-bold">Encrypted</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl"
                >
                  Upload & Secure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Reschedule with {reschedulingApt.doctorName}
              </h3>
              <button onClick={() => setReschedulingApt(null)} className="text-slate-400">✕</button>
            </div>

            {rescheduleMsg && (
              <div className="p-2.5 bg-sky-50 text-sky-800 text-xs rounded-xl font-medium">
                {rescheduleMsg}
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select New Time Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReschedulingApt(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl"
                >
                  Update Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Rate Consultation with {reviewingApt.doctorName}
              </h3>
              <button onClick={() => setReviewingApt(null)} className="text-slate-400">✕</button>
            </div>

            {reviewSubmittedMsg ? (
              <div className="p-4 text-center bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                Thank you! Your verified review has been submitted successfully.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-2xl text-amber-400 cursor-pointer"
                      >
                        {star <= reviewRating ? '★' : '☆'}
                      </button>
                    ))}
                    <span className="text-slate-600 font-semibold ml-2">
                      {reviewRating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Review & Experience *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share how doctor treated you, clarity of explanation, outcome..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewingApt(null)}
                    className="px-4 py-2 font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-semibold text-white bg-sky-600 rounded-xl"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
