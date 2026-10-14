import React, { useState } from 'react';
import { X, Code2, Copy, Check, FileCode, Server, Layers, Download } from 'lucide-react';
import { useCare } from '../context/CareContext';

const FLUTTER_MAIN_DART = `// ==========================================
// lib/main.dart - Care+ Flutter Application Entry
// ==========================================
import 'package:flutter/material.dart';
import 'package:care_plus/screens/landing_screen.dart';
import 'package:care_plus/screens/patient_dashboard_screen.dart';
import 'package:care_plus/screens/doctor_portal_screen.dart';
import 'package:care_plus/screens/admin_portal_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CarePlusApp());
}

class CarePlusApp extends StatelessWidget {
  const CarePlusApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Care+ Healthcare Platform',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0284C7),
          primary: const Color(0xFF0284C7),
          surface: Colors.white,
        ),
        fontFamily: 'PlusJakartaSans',
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const LandingScreen(),
        '/patient': (context) => const PatientDashboardScreen(),
        '/doctor': (context) => const DoctorPortalScreen(),
        '/admin': (context) => const AdminPortalScreen(),
      },
    );
  }
}`;

const FLUTTER_DOCTOR_MODEL = `// ==========================================
// lib/models/doctor.dart - Doctor Model
// ==========================================
class Doctor {
  final String id;
  final String name;
  final String avatar;
  final String specialty;
  final String qualifications;
  final String registrationNumber;
  final int experienceYears;
  final double rating;
  final int reviewCount;
  final double fee; // in ₹
  final String availabilityStatus;
  final String verificationStatus; // 'verified', 'pending', 'rejected'
  final bool requiresDoctorApproval;
  final String clinicAddress;
  final List<String> timeSlots;

  Doctor({
    required this.id,
    required this.name,
    required this.avatar,
    required this.specialty,
    required this.qualifications,
    required this.registrationNumber,
    required this.experienceYears,
    required this.rating,
    required this.reviewCount,
    required this.fee,
    required this.availabilityStatus,
    required this.verificationStatus,
    required this.requiresDoctorApproval,
    required this.clinicAddress,
    required this.timeSlots,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['id'],
      name: json['name'],
      avatar: json['avatar'],
      specialty: json['specialty'],
      qualifications: json['qualifications'],
      registrationNumber: json['registration_number'] ?? '',
      experienceYears: json['experience_years'],
      rating: (json['rating'] as num).toDouble(),
      reviewCount: json['review_count'],
      fee: (json['fee'] as num).toDouble(),
      availabilityStatus: json['availability_status'],
      verificationStatus: json['verification_status'],
      requiresDoctorApproval: json['requires_doctor_approval'] ?? false,
      clinicAddress: json['clinic_address'] ?? '',
      timeSlots: List<String>.from(json['time_slots'] ?? []),
    );
  }
}`;

const FLUTTER_API_SERVICE = `// ==========================================
// lib/services/api_service.dart - Django DRF Client
// ==========================================
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:care_plus/models/doctor.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8000/api';

  // 1. Fetch Verified Doctors with Optional Specialty Filter
  static Future<List<Doctor>> getDoctors({String? specialty}) async {
    final uri = Uri.parse('$baseUrl/doctors/').replace(
      queryParameters: specialty != null ? {'specialty': specialty} : null,
    );
    final response = await http.get(uri);
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((d) => Doctor.fromJson(d)).toList();
    }
    throw Exception('Failed to load doctors: \${response.statusCode}');
  }

  // 2. Book Appointment with Duplicate Slot Check
  static Future<Map<String, dynamic>> bookAppointment({
    required String doctorId,
    required String date,
    required String timeSlot,
    required String type,
    required String reason,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/appointments/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'doctor_id': doctorId,
        'date': date,
        'time_slot': timeSlot,
        'consultation_type': type,
        'reason': reason,
      }),
    );
    return jsonDecode(response.body);
  }
}`;

const DJANGO_MODELS_PY = `# ==========================================
# careplus/models.py - Django Models & SQLite Schema
# ==========================================
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    phone = models.CharField(max_length=15, blank=True)
    blood_group = models.CharField(max_length=10, blank=True)

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialty = models.CharField(max_length=100)
    qualifications = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, unique=True)
    experience_years = models.IntegerField(default=5)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    review_count = models.IntegerField(default=0)
    fee = models.DecimalField(max_digits=10, decimal_places=2) # in INR
    verification_status = models.CharField(
        max_length=20,
        choices=(('verified', 'Verified'), ('pending', 'Pending'), ('rejected', 'Rejected')),
        default='pending'
    )
    requires_doctor_approval = models.BooleanField(default=False)
    clinic_address = models.TextField()

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rejected', 'Rejected'),
    )
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='doctor_appointments')
    date = models.DateField()
    time_slot = models.CharField(max_length=20)
    consultation_type = models.CharField(max_length=20, choices=(('video', 'Video'), ('in_clinic', 'In Clinic')))
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField()
    symptoms = models.TextField(blank=True)
    consultation_notes = models.TextField(blank=True)
    prescription = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Backend rule: Enforce unique doctor + date + slot constraint to prevent double-booking
        unique_together = ('doctor', 'date', 'time_slot')`;

export const FlutterCodeViewerModal: React.FC = () => {
  const { showFlutterCodeModal, setShowFlutterCodeModal } = useCare();
  const [activeTab, setActiveTab] = useState<'main' | 'model' | 'api' | 'django'>('main');
  const [copied, setCopied] = useState(false);

  if (!showFlutterCodeModal) return null;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'main':
        return FLUTTER_MAIN_DART;
      case 'model':
        return FLUTTER_DOCTOR_MODEL;
      case 'api':
        return FLUTTER_API_SERVICE;
      case 'django':
        return DJANGO_MODELS_PY;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full h-[85vh] overflow-hidden shadow-2xl border border-slate-800 flex flex-col text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Flutter .dart & Django REST Framework Code</h2>
              <p className="text-xs text-slate-400">Complete cross-platform source files & backend architecture</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/care_plus_project.zip"
              download="care_plus_project.zip"
              className="px-3 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              title="Download entire codebase with Flutter app, Django backend, and React web app"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP (2.1 MB)</span>
            </a>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
            <button
              onClick={() => setShowFlutterCodeModal(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 cursor-pointer ${
              activeTab === 'main' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>lib/main.dart</span>
          </button>

          <button
            onClick={() => setActiveTab('model')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 cursor-pointer ${
              activeTab === 'model' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>lib/models/doctor.dart</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 cursor-pointer ${
              activeTab === 'api' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>lib/services/api_service.dart</span>
          </button>

          <button
            onClick={() => setActiveTab('django')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 cursor-pointer ${
              activeTab === 'django' ? 'bg-blue-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>django/models.py (DRF & SQLite)</span>
          </button>
        </div>

        {/* Code Content View */}
        <div className="flex-1 p-4 overflow-auto bg-slate-950 font-mono text-xs text-slate-200">
          <pre className="whitespace-pre">{getActiveCode()}</pre>
        </div>
      </div>
    </div>
  );
};
