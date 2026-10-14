import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  User,
  FileText,
  Star,
  Settings,
  Plus,
  Building,
  Check,
  Eye,
  Stethoscope,
  Users,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useCare } from '../context/CareContext';
import { Doctor, Appointment } from '../types';

export const DoctorPortal: React.FC = () => {
  const {
    doctors,
    currentDoctorId,
    setCurrentDoctorId,
    currentDoctor,
    appointments,
    healthRecords,
    reviews,
    approveAppointment,
    rejectAppointment,
    updateDoctorProfile,
    registerDoctor,
    setVideoAppointment,
  } = useCare();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'requests' | 'patients' | 'profile' | 'register'>('dashboard');

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regSpecialty, setRegSpecialty] = useState('Cardiology');
  const [regQuals, setRegQuals] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [regExp, setRegExp] = useState(8);
  const [regFee, setRegFee] = useState(900);
  const [regBio, setRegBio] = useState('');
  const [regHospital, setRegHospital] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState(false);

  // Profile edit state
  const [editFee, setEditFee] = useState(currentDoctor?.fee || 1200);
  const [editBio, setEditBio] = useState(currentDoctor?.bio || '');
  const [editApprovalMode, setEditApprovalMode] = useState(currentDoctor?.requiresDoctorApproval || false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  if (!currentDoctor) {
    return (
      <div className="p-8 text-center text-slate-500">
        Doctor profile not found. Please select an active practitioner.
      </div>
    );
  }

  // Doctor's appointments
  const doctorAppointments = appointments.filter((a) => a.doctorId === currentDoctor.id);
  const pendingRequests = doctorAppointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = doctorAppointments.filter((a) => a.status === 'confirmed');
  const completedAppointments = doctorAppointments.filter((a) => a.status === 'completed');

  // Doctor's reviews
  const doctorReviews = reviews.filter((r) => r.doctorId === currentDoctor.id);

  // Privacy rule: Doctor can ONLY see records of patients who booked with this doctor
  const authorizedPatientIds = Array.from(new Set(doctorAppointments.map((a) => a.patientId)));
  const visibleHealthRecords = healthRecords.filter(
    (rec) => authorizedPatientIds.includes(rec.patientId)
  );

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regNumber.trim()) return;

    registerDoctor({
      name: regName.startsWith('Dr.') ? regName : `Dr. ${regName}`,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      specialty: regSpecialty,
      qualifications: regQuals || 'MBBS, MD',
      registrationNumber: regNumber,
      experienceYears: Number(regExp),
      fee: Number(regFee),
      availabilityStatus: 'Available Today',
      requiresDoctorApproval: true,
      bio: regBio || 'Consultant specialist providing evidence-based healthcare.',
      clinicAddress: 'Care+ Healthcare Tower, Ring Road',
      hospitalAffiliation: regHospital || 'Apollo Super Specialty Hospital',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      timeSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM', '06:00 PM'],
    });

    setRegSuccessMsg(true);
    setTimeout(() => {
      setRegSuccessMsg(false);
      setActiveTab('dashboard');
    }, 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctorProfile(currentDoctor.id, {
      fee: Number(editFee),
      bio: editBio,
      requiresDoctorApproval: editApprovalMode,
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Verification Status Banner (if pending or rejected) */}
        {currentDoctor.verificationStatus === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start gap-3.5 text-amber-900 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-sm font-bold block">
                Verification In Progress (Medical Council Credentials Under Review)
              </strong>
              <p>
                Your registration certificate (<strong>{currentDoctor.registrationNumber}</strong>) has been queued for administrative review. You can configure your profile and slots, but public patients will only see your profile after Admin approves verification.
              </p>
            </div>
          </div>
        )}

        {/* Top Doctor Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={currentDoctor.avatar}
              alt={currentDoctor.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {currentDoctor.name}
                </h1>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    currentDoctor.verificationStatus === 'verified'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {currentDoctor.verificationStatus === 'verified' ? 'Verified Practitioner' : 'Pending Verification'}
                </span>
              </div>
              <p className="text-xs font-semibold text-sky-700 mt-0.5">
                {currentDoctor.specialty} · {currentDoctor.qualifications}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Reg: {currentDoctor.registrationNumber} · {currentDoctor.hospitalAffiliation} · Fee: ₹{currentDoctor.fee}
              </p>
            </div>
          </div>

          {/* Quick Doctor Profile Switcher (for demo evaluation) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Switch Practitioner View:
              </span>
              <select
                value={currentDoctorId}
                onChange={(e) => setCurrentDoctorId(e.target.value)}
                className="mt-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty}) {d.verificationStatus === 'pending' ? '[Pending]' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveTab('register')}
              className="px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Doctor</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-2xl w-fit overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'requests' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <span>Booking Requests</span>
            {pendingRequests.length > 0 && (
              <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-md font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'patients' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <span>Assigned Patient Records</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-md font-bold">
              {visibleHealthRecords.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Profile & Slots
          </button>
        </div>

        {/* Tab 1: Doctor Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {confirmedAppointments.length}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Upcoming Confirmed</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-2xl font-extrabold text-amber-600 tabular-nums">
                  {pendingRequests.length}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Pending Approval Requests</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-2xl font-extrabold text-emerald-600 tabular-nums">
                  {completedAppointments.length}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Consultations Completed</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-2xl font-extrabold text-sky-700 tabular-nums">
                  ★ {currentDoctor.rating.toFixed(1)}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rating ({currentDoctor.reviewCount} Reviews)
                </p>
              </div>
            </div>

            {/* Confirmed Schedule & Actions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>Confirmed Appointment Schedule</span>
                </h2>
                <span className="text-xs text-slate-500">
                  {confirmedAppointments.length} Bookings
                </span>
              </div>

              {confirmedAppointments.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
                  No confirmed bookings scheduled at this time.
                </div>
              ) : (
                <div className="space-y-3">
                  {confirmedAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                          {apt.patientName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {apt.patientName}
                            </span>
                            <span className="text-slate-400">({apt.patientPhone})</span>
                          </div>
                          <p className="text-slate-600 mt-0.5">
                            {apt.date} at <strong className="text-slate-900">{apt.timeSlot}</strong> · Mode:{' '}
                            <span className="text-sky-700 font-semibold">
                              {apt.type === 'video' ? 'Video Consult' : 'In-Clinic'}
                            </span>
                          </p>
                          <p className="text-slate-500 mt-1 italic">Reason: {apt.reason}</p>
                          {apt.symptoms && (
                            <p className="text-slate-600 mt-0.5">Symptoms: {apt.symptoms}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {apt.type === 'video' && (
                          <button
                            onClick={() => setVideoAppointment(apt)}
                            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Start Video Consultation</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Patient Feedback */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Verified Patient Reviews & Feedback</span>
              </h2>

              {doctorReviews.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No patient reviews recorded yet for this doctor.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctorReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rev.patientName}</span>
                        <div className="flex items-center text-amber-500">
                          {'★'.repeat(rev.rating)}
                          {'☆'.repeat(5 - rev.rating)}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                      <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Booking Requests (Approve / Reject) */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Patient Booking Requests Awaiting Doctor Approval
              </h2>
              <p className="text-xs text-slate-500">
                Review patient symptoms and schedule before approving or declining
              </p>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-100">
                No pending booking requests at this time.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{apt.patientName}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                          Approval Pending
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        Requested Slot: <strong className="text-slate-900">{apt.date}</strong> at{' '}
                        <strong className="text-slate-900">{apt.timeSlot}</strong> ({apt.type === 'video' ? 'Video' : 'In-Clinic'})
                      </p>
                      <p className="text-slate-800 mt-1 font-medium">
                        Primary Reason: {apt.reason}
                      </p>
                      {apt.symptoms && (
                        <p className="text-slate-600 mt-0.5">Symptoms: {apt.symptoms}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => rejectAppointment(apt.id, 'Doctor unavailable at chosen time')}
                        className="px-3.5 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>

                      <button
                        onClick={() => approveAppointment(apt.id)}
                        className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Confirm</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Assigned Patient Records (Strict Privacy Enforced) */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Permitted Health Records of Assigned Patients
              </h2>
              <p className="text-xs text-slate-500">
                Strict Healthcare Privacy Rule: You can only view health records and lab diagnostics of patients who have active or past appointments with you.
              </p>
            </div>

            {visibleHealthRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No health records uploaded by your assigned patients yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleHealthRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded-md text-[10px]">
                        {rec.category}
                      </span>
                      <span className="text-slate-400">{rec.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{rec.title}</h3>
                    <p className="text-slate-600">{rec.summary}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-slate-400">{rec.fileType} · {rec.fileSize}</span>
                      <button
                        onClick={() => alert(`Reviewing record: ${rec.title}\n\nClinical notes: ${rec.summary}`)}
                        className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Record</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile & Slots Configuration */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manage Practice Profile & Booking Settings</h2>
              <p className="text-xs text-slate-500">Update consultation fee in ₹, bio, and instant vs approval booking policies</p>
            </div>

            {profileSavedMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl">
                Profile and booking rules updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Consultation Fee (in ₹) *</label>
                <input
                  type="number"
                  required
                  value={editFee}
                  onChange={(e) => setEditFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Booking Confirmation Policy</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="approvalMode"
                      checked={!editApprovalMode}
                      onChange={() => setEditApprovalMode(false)}
                    />
                    <span className="font-semibold text-slate-800">
                      Instant Booking (Patients confirm immediately if slot is free)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="approvalMode"
                      checked={editApprovalMode}
                      onChange={() => setEditApprovalMode(true)}
                    />
                    <span className="font-semibold text-slate-800">
                      Require Doctor Approval (You review reason & symptoms first)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Bio & Specializations</label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl cursor-pointer shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 5: Doctor Registration Flow */}
        {activeTab === 'register' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Join Care+ Medical Network</h2>
              <p className="text-xs text-slate-500">
                Register a new medical practitioner. All newly registered doctors remain pending until verified by Care+ Admin.
              </p>
            </div>

            {regSuccessMsg && (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl">
                Registration submitted successfully! Your credentials have been queued for Admin verification.
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Raghavendra Rao"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Medical Council Reg. Number *</label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    placeholder="e.g. MCI-90412"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialty *</label>
                  <select
                    value={regSpecialty}
                    onChange={(e) => setRegSpecialty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="ENT">ENT</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience (Years) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={regExp}
                    onChange={(e) => setRegExp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Consultation Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={regFee}
                    onChange={(e) => setRegFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Qualifications *</label>
                <input
                  type="text"
                  required
                  value={regQuals}
                  onChange={(e) => setRegQuals(e.target.value)}
                  placeholder="e.g. MBBS, MD (Internal Medicine, AIIMS)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hospital / Clinic Affiliation</label>
                <input
                  type="text"
                  value={regHospital}
                  onChange={(e) => setRegHospital(e.target.value)}
                  placeholder="e.g. Fortis Hospital, Apollo Clinic"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Biography</label>
                <textarea
                  rows={3}
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  placeholder="Clinical experience, areas of interest..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs"
                >
                  Submit Registration for Verification
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
