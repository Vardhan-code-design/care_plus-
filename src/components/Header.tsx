import React, { useState } from 'react';
import {
  Stethoscope,
  Search,
  User,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  Code2,
  Calendar,
  Download,
} from 'lucide-react';
import { useCare } from '../context/CareContext';

interface HeaderProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateSection }) => {
  const {
    role,
    setRole,
    searchQuery,
    setSearchQuery,
    setShowFlutterCodeModal,
    appointments,
    currentPatient,
    doctors,
    currentDoctorId,
  } = useCare();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingAppointmentsCount = appointments.filter(
    (a) => a.doctorId === currentDoctorId && a.status === 'pending'
  ).length;

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (role !== 'public') {
      setRole('public');
    }
    setTimeout(() => {
      if (onNavigateSection) {
        onNavigateSection(sectionId);
      } else {
        const elem = document.getElementById(sectionId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner / Healthcare Hotline strip */}
      <div className="bg-sky-50 border-b border-sky-100 px-4 py-1.5 text-xs text-sky-900 hidden sm:flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sky-700">24/7 Care+ Helpline:</span>
            <span>+91 1800-209-CARE (Toll Free)</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">Immediate Video Consultations & In-Clinic Bookings</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/care_plus_project.zip"
              download="care_plus_project.zip"
              className="inline-flex items-center gap-1.5 text-white bg-sky-600 hover:bg-sky-700 font-semibold px-2.5 py-0.5 rounded-md transition-colors cursor-pointer shadow-xs"
              title="Download Complete Project (Flutter Dart, Django, React) as ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP (2.1 MB)</span>
            </a>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setShowFlutterCodeModal(true)}
              className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-900 font-medium transition-colors cursor-pointer"
              title="View Flutter .dart source code & Django DRF architecture"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Flutter .dart & Django</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">ISO 27001 Certified Secure Health Platform</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4 lg:gap-8">
          {/* Zone 1: Brand Lockup */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                    Care<span className="text-sky-600">+</span>
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 tracking-normal hidden md:inline">
                  Your Health. Our Priority.
                </span>
              </div>
            </button>
          </div>

          {/* Search Input in Top Bar (Quick Doctor Search) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (role !== 'public') setRole('public');
              }}
              placeholder="Search doctors, specializations (e.g. Cardiology, Dr. Sharma)..."
              className="w-full pl-9.5 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Zone 2: Navigation Links (Public View) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-sky-600 transition-colors whitespace-nowrap cursor-pointer ${
                role === 'public' ? 'text-sky-600 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('find-doctors')}
              className="hover:text-sky-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              Find Doctors
            </button>
            <button
              onClick={() => handleNavClick('specialties')}
              className="hover:text-sky-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              Specialties
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="hover:text-sky-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="hover:text-sky-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              How It Works
            </button>
          </nav>

          {/* Zone 3: Role Switcher / Authentication Portals */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Role switch bar */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setRole('public')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  role === 'public'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View Public Care+ Website"
              >
                Public
              </button>

              <button
                onClick={() => setRole('patient')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  role === 'patient'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Patient Portal"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Patient Portal</span>
              </button>

              <button
                onClick={() => setRole('doctor')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 relative cursor-pointer ${
                  role === 'doctor'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Doctor Portal"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Doctor Portal</span>
                {pendingAppointmentsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white"></span>
                )}
              </button>

              <button
                onClick={() => setRole('admin')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  role === 'admin'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Admin Management Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden py-2 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors, specializations..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-sky-600 font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('find-doctors')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Find Doctors
            </button>
            <button
              onClick={() => handleNavClick('specialties')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Specialties
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              How Care+ Works
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
              Access Portals
            </div>
            <button
              onClick={() => {
                setRole('patient');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-sky-50 text-sky-800 font-medium text-sm"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-sky-600" />
                <span>Patient Portal ({currentPatient.name})</span>
              </div>
              <span className="text-xs bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded-md">
                Active
              </span>
            </button>

            <button
              onClick={() => {
                setRole('doctor');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50 text-blue-800 font-medium text-sm"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Doctor Portal (Manage Care)</span>
              </div>
              {pendingAppointmentsCount > 0 && (
                <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                  {pendingAppointmentsCount} Requests
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setRole('admin');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 text-slate-800 font-medium text-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span>Admin Portal (Verification & Audit)</span>
              </div>
            </button>

            <button
              onClick={() => {
                setShowFlutterCodeModal(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm mt-1"
            >
              <Code2 className="w-4 h-4 text-sky-600" />
              <span>Flutter .dart & Django Specs</span>
            </button>

            <a
              href="/care_plus_project.zip"
              download="care_plus_project.zip"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-sky-600 text-white font-semibold text-sm mt-1 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Project ZIP (2.1 MB)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
