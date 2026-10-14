import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor,
  Appointment,
  Patient,
  HealthRecord,
  Review,
  UserRole,
  VerificationStatus,
  AuditLog,
} from '../types';
import {
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_HEALTH_RECORDS,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

export const CURRENT_PATIENT: Patient = {
  id: 'patient-1',
  name: 'Rohan Deshmukh',
  email: 'rohan.deshmukh@example.com',
  phone: '+91 98201 45678',
  age: 34,
  gender: 'Male',
  bloodGroup: 'B+ Positive',
  allergies: ['Penicillin', 'Dust mites'],
};

interface CareContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentPatient: Patient;
  currentDoctorId: string;
  setCurrentDoctorId: (id: string) => void;
  currentDoctor: Doctor | undefined;
  doctors: Doctor[];
  appointments: Appointment[];
  healthRecords: HealthRecord[];
  reviews: Review[];
  auditLogs: AuditLog[];
  favoriteDoctorIds: string[];
  toggleFavorite: (doctorId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSpecialty: string | null;
  setSelectedSpecialty: (specialty: string | null) => void;

  // Booking & Appointment operations
  bookAppointment: (params: {
    doctorId: string;
    date: string;
    timeSlot: string;
    type: 'video' | 'in_clinic';
    reason: string;
    symptoms?: string;
  }) => { success: boolean; message: string; appointment?: Appointment };
  approveAppointment: (appointmentId: string) => void;
  rejectAppointment: (appointmentId: string, reason?: string) => void;
  cancelAppointment: (appointmentId: string) => void;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTimeSlot: string) => { success: boolean; message: string };
  completeAppointment: (appointmentId: string, notes: string, prescription: string) => void;

  // Doctor operations
  registerDoctor: (doctorData: Omit<Doctor, 'id' | 'rating' | 'reviewCount' | 'verificationStatus'>) => void;
  verifyDoctor: (doctorId: string, status: VerificationStatus) => void;
  updateDoctorProfile: (doctorId: string, updates: Partial<Doctor>) => void;

  // Health records & Reviews
  uploadHealthRecord: (record: Omit<HealthRecord, 'id' | 'patientId' | 'date'>) => void;
  submitReview: (appointmentId: string, doctorId: string, rating: number, comment: string) => void;
  moderateReview: (reviewId: string, status: 'approved' | 'flagged') => void;

  // Modals & Navigation
  bookingDoctor: Doctor | null;
  setBookingDoctor: (doctor: Doctor | null) => void;
  videoAppointment: Appointment | null;
  setVideoAppointment: (appointment: Appointment | null) => void;
  showVideoModal: boolean;
  setShowVideoModal: (show: boolean) => void;
  showSmartCareModal: boolean;
  setShowSmartCareModal: (show: boolean) => void;
  showPrepAssistantModal: boolean;
  setShowPrepAssistantModal: (show: boolean) => void;
  showFlutterCodeModal: boolean;
  setShowFlutterCodeModal: (show: boolean) => void;
}

const CareContext = createContext<CareContextType | undefined>(undefined);

export const CareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user role
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('care_role');
    return (saved as UserRole) || 'public';
  });

  const [currentDoctorId, setCurrentDoctorId] = useState<string>('doc-1');

  // Core state with local storage fallback
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('care_doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('care_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => {
    const saved = localStorage.getItem('care_records');
    return saved ? JSON.parse(saved) : INITIAL_HEALTH_RECORDS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('care_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('care_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [favoriteDoctorIds, setFavoriteDoctorIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('care_favorites');
    return saved ? JSON.parse(saved) : ['doc-1', 'doc-4'];
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  // Modals
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [videoAppointment, setVideoAppointment] = useState<Appointment | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showSmartCareModal, setShowSmartCareModal] = useState(false);
  const [showPrepAssistantModal, setShowPrepAssistantModal] = useState(false);
  const [showFlutterCodeModal, setShowFlutterCodeModal] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('care_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('care_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('care_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('care_records', JSON.stringify(healthRecords));
  }, [healthRecords]);

  useEffect(() => {
    localStorage.setItem('care_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('care_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('care_favorites', JSON.stringify(favoriteDoctorIds));
  }, [favoriteDoctorIds]);

  const addAuditLog = (action: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorRole: role,
      actorName:
        role === 'patient'
          ? CURRENT_PATIENT.name
          : role === 'doctor'
          ? (doctors.find((d) => d.id === currentDoctorId)?.name || 'Doctor')
          : 'Care+ Admin',
      action,
      target,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const toggleFavorite = (doctorId: string) => {
    setFavoriteDoctorIds((prev) =>
      prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId]
    );
  };

  // Safe role switcher
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentDoctor = doctors.find((d) => d.id === currentDoctorId);

  // Validate duplicate slot booking
  const isSlotTaken = (doctorId: string, date: string, timeSlot: string, excludeAppointmentId?: string) => {
    return appointments.some((apt) => {
      if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;
      return (
        apt.doctorId === doctorId &&
        apt.date === date &&
        apt.timeSlot === timeSlot &&
        apt.status !== 'cancelled' &&
        apt.status !== 'rejected'
      );
    });
  };

  const bookAppointment = ({
    doctorId,
    date,
    timeSlot,
    type,
    reason,
    symptoms,
  }: {
    doctorId: string;
    date: string;
    timeSlot: string;
    type: 'video' | 'in_clinic';
    reason: string;
    symptoms?: string;
  }) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) {
      return { success: false, message: 'Doctor not found.' };
    }

    if (doctor.verificationStatus !== 'verified') {
      return { success: false, message: 'This practitioner is currently pending admin verification.' };
    }

    // Backend rule: Revalidate slot availability
    if (isSlotTaken(doctorId, date, timeSlot)) {
      return {
        success: false,
        message: `The ${timeSlot} slot on ${date} has already been reserved. Please select another time slot.`,
      };
    }

    const initialStatus = doctor.requiresDoctorApproval ? 'pending' : 'confirmed';

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: CURRENT_PATIENT.id,
      patientName: CURRENT_PATIENT.name,
      patientPhone: CURRENT_PATIENT.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorAvatar: doctor.avatar,
      date,
      timeSlot,
      type,
      status: initialStatus,
      fee: doctor.fee,
      reason,
      symptoms,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      meetingLink: type === 'video' ? `https://meet.careplus.health/room-apt${Date.now().toString().slice(-4)}` : undefined,
      hasReviewed: false,
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    addAuditLog(
      initialStatus === 'confirmed' ? 'APPOINTMENT_INSTANT_CONFIRMED' : 'APPOINTMENT_REQUEST_SUBMITTED',
      `${doctor.name} (${date} ${timeSlot})`,
      `Booking by ${CURRENT_PATIENT.name}. Status: ${initialStatus}. Fee: ₹${doctor.fee}`
    );

    return {
      success: true,
      message:
        initialStatus === 'confirmed'
          ? 'Your appointment has been instantly confirmed!'
          : 'Appointment request submitted. Awaiting doctor confirmation.',
      appointment: newAppointment,
    };
  };

  const approveAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, status: 'confirmed', updatedAt: new Date().toISOString() }
          : apt
      )
    );
    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      addAuditLog('APPOINTMENT_APPROVED', apt.doctorName, `Dr. approved booking for ${apt.patientName} on ${apt.date}`);
    }
  };

  const rejectAppointment = (appointmentId: string, reason?: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, status: 'rejected', consultationNotes: reason, updatedAt: new Date().toISOString() }
          : apt
      )
    );
    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      addAuditLog('APPOINTMENT_REJECTED', apt.doctorName, `Dr. declined booking for ${apt.patientName}`);
    }
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, status: 'cancelled', updatedAt: new Date().toISOString() }
          : apt
      )
    );
    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      addAuditLog('APPOINTMENT_CANCELLED', apt.doctorName, `Cancelled appointment for ${apt.patientName} on ${apt.date}`);
    }
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newTimeSlot: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return { success: false, message: 'Appointment not found' };

    if (isSlotTaken(apt.doctorId, newDate, newTimeSlot, appointmentId)) {
      return { success: false, message: `The ${newTimeSlot} slot on ${newDate} is already booked.` };
    }

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? { ...a, date: newDate, timeSlot: newTimeSlot, updatedAt: new Date().toISOString() }
          : a
      )
    );

    addAuditLog('APPOINTMENT_RESCHEDULED', apt.doctorName, `Rescheduled to ${newDate} at ${newTimeSlot}`);
    return { success: true, message: 'Appointment rescheduled successfully!' };
  };

  const completeAppointment = (appointmentId: string, notes: string, prescription: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              status: 'completed',
              consultationNotes: notes,
              prescription,
              updatedAt: new Date().toISOString(),
            }
          : apt
      )
    );

    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt && prescription) {
      // Auto create a Health Record prescription for the patient!
      const newRecord: HealthRecord = {
        id: `rec-${Date.now()}`,
        patientId: apt.patientId,
        doctorId: apt.doctorId,
        doctorName: apt.doctorName,
        title: `Clinical Prescription - ${apt.doctorSpecialty}`,
        category: 'Prescription',
        date: new Date().toISOString().substring(0, 10),
        fileSize: '350 KB',
        fileType: 'PDF',
        summary: prescription.split('\n')[0] || 'Medical consultation prescription issued.',
      };
      setHealthRecords((prev) => [newRecord, ...prev]);
    }

    addAuditLog('APPOINTMENT_COMPLETED', apt ? apt.doctorName : 'Doctor', `Consultation finished for ${apt?.patientName}`);
  };

  const registerDoctor = (doctorData: Omit<Doctor, 'id' | 'rating' | 'reviewCount' | 'verificationStatus'>) => {
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      verificationStatus: 'pending', // Requires admin verification!
    };
    setDoctors((prev) => [...prev, newDoc]);
    setCurrentDoctorId(newDoc.id);
    addAuditLog('DOCTOR_REGISTERED', newDoc.name, `New doctor registration (${newDoc.specialty}). Status: pending admin verification.`);
  };

  const verifyDoctor = (doctorId: string, status: VerificationStatus) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, verificationStatus: status } : d))
    );
    const doc = doctors.find((d) => d.id === doctorId);
    addAuditLog(
      status === 'verified' ? 'DOCTOR_VERIFIED_APPROVED' : 'DOCTOR_VERIFICATION_REJECTED',
      doc?.name || doctorId,
      `Admin updated status to ${status}`
    );
  };

  const updateDoctorProfile = (doctorId: string, updates: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, ...updates } : d))
    );
    addAuditLog('DOCTOR_PROFILE_UPDATED', doctorId, 'Doctor updated fees, bio, or schedule');
  };

  const uploadHealthRecord = (record: Omit<HealthRecord, 'id' | 'patientId' | 'date'>) => {
    const newRec: HealthRecord = {
      ...record,
      id: `rec-${Date.now()}`,
      patientId: CURRENT_PATIENT.id,
      date: new Date().toISOString().substring(0, 10),
    };
    setHealthRecords((prev) => [newRec, ...prev]);
    addAuditLog('HEALTH_RECORD_UPLOADED', newRec.title, `Uploaded by ${CURRENT_PATIENT.name}`);
  };

  const submitReview = (appointmentId: string, doctorId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      appointmentId,
      doctorId,
      patientId: CURRENT_PATIENT.id,
      patientName: CURRENT_PATIENT.name,
      rating,
      comment,
      date: new Date().toISOString().substring(0, 10),
      status: 'approved',
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update doctor's review count and rating
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === doctorId) {
          const currentTotal = doc.rating * doc.reviewCount;
          const nextCount = doc.reviewCount + 1;
          const nextRating = Number(((currentTotal + rating) / nextCount).toFixed(1));
          return { ...doc, reviewCount: nextCount, rating: nextRating };
        }
        return doc;
      })
    );

    // Mark appointment as reviewed
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, hasReviewed: true } : apt))
    );

    addAuditLog('REVIEW_SUBMITTED', `Doctor ${doctorId}`, `Patient rating: ${rating}★`);
  };

  const moderateReview = (reviewId: string, status: 'approved' | 'flagged') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
    addAuditLog('REVIEW_MODERATED', reviewId, `Admin set review status to: ${status}`);
  };

  return (
    <CareContext.Provider
      value={{
        role,
        setRole,
        currentPatient: CURRENT_PATIENT,
        currentDoctorId,
        setCurrentDoctorId,
        currentDoctor,
        doctors,
        appointments,
        healthRecords,
        reviews,
        auditLogs,
        favoriteDoctorIds,
        toggleFavorite,
        searchQuery,
        setSearchQuery,
        selectedSpecialty,
        setSelectedSpecialty,
        bookAppointment,
        approveAppointment,
        rejectAppointment,
        cancelAppointment,
        rescheduleAppointment,
        completeAppointment,
        registerDoctor,
        verifyDoctor,
        updateDoctorProfile,
        uploadHealthRecord,
        submitReview,
        moderateReview,
        bookingDoctor,
        setBookingDoctor,
        videoAppointment,
        setVideoAppointment,
        showVideoModal,
        setShowVideoModal,
        showSmartCareModal,
        setShowSmartCareModal,
        showPrepAssistantModal,
        setShowPrepAssistantModal,
        showFlutterCodeModal,
        setShowFlutterCodeModal,
      }}
    >
      {children}
    </CareContext.Provider>
  );
};

export const useCare = () => {
  const context = useContext(CareContext);
  if (!context) {
    throw new Error('useCare must be used within a CareProvider');
  }
  return context;
};
