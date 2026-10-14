export type UserRole = 'patient' | 'doctor' | 'admin' | 'public';

export type ConsultationType = 'video' | 'in_clinic';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export interface Doctor {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  qualifications: string; // e.g. MBBS, MD (Cardiology)
  registrationNumber: string; // Medical Council Reg No.
  experienceYears: number;
  rating: number;
  reviewCount: number;
  fee: number; // in ₹
  availabilityStatus: 'Available Today' | 'Next Available Tomorrow' | 'Available this Week';
  verificationStatus: VerificationStatus;
  requiresDoctorApproval: boolean; // if false, instant booking
  bio: string;
  clinicAddress: string;
  hospitalAffiliation: string;
  availableDays: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  timeSlots: string[]; // ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM']
  isFeatured?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. 10:30 AM
  type: ConsultationType;
  status: AppointmentStatus;
  fee: number;
  reason: string;
  symptoms?: string;
  createdAt: string;
  updatedAt: string;
  consultationNotes?: string;
  prescription?: string;
  meetingLink?: string;
  hasReviewed?: boolean;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  doctorId?: string;
  title: string;
  category: 'Prescription' | 'Lab Report' | 'Imaging' | 'Discharge Summary' | 'Vaccination';
  date: string;
  fileSize: string;
  fileType: string;
  doctorName?: string;
  summary: string;
  downloadUrl?: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'flagged';
}

export interface SpecialtyInfo {
  id: string;
  name: string;
  iconName: string;
  doctorCount: number;
  description: string;
  color: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  target: string;
  details: string;
}

export interface SymptomPrepNote {
  id: string;
  appointmentId: string;
  symptoms: string[];
  duration: string;
  questionsForDoctor: string[];
  currentMedications: string[];
}
