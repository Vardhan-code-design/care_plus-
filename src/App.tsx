/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CareProvider, useCare } from './context/CareContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SpecialtiesSection } from './components/SpecialtiesSection';
import { DoctorSearchSection } from './components/DoctorSearchSection';
import { ServiceHighlights } from './components/ServiceHighlights';
import { HowItWorks } from './components/HowItWorks';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { VideoConsultationRoom } from './components/VideoConsultationRoom';
import { VideoModal } from './components/VideoModal';
import { SmartCareGuideModal } from './components/SmartCareGuideModal';
import { PrepAssistantModal } from './components/PrepAssistantModal';
import { FlutterCodeViewerModal } from './components/FlutterCodeViewerModal';
import { PatientPortal } from './components/PatientPortal';
import { DoctorPortal } from './components/DoctorPortal';
import { AdminPortal } from './components/AdminPortal';

const MainContent: React.FC = () => {
  const {
    role,
    bookingDoctor,
    setBookingDoctor,
    videoAppointment,
    setVideoAppointment,
  } = useCare();

  const handleScrollToSearch = () => {
    const el = document.getElementById('find-doctors');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      {/* Top Header */}
      <Header
        onNavigateSection={(id) => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main View Router based on Role */}
      <main className="flex-1">
        {role === 'public' && (
          <div id="home">
            <Hero onFindDoctorClick={handleScrollToSearch} />
            <SpecialtiesSection onSpecialtySelected={handleScrollToSearch} />
            <DoctorSearchSection />
            <ServiceHighlights />
            <HowItWorks onFindDoctorClick={handleScrollToSearch} />
            <TestimonialsSection />
            <FaqSection />
          </div>
        )}

        {role === 'patient' && <PatientPortal />}

        {role === 'doctor' && <DoctorPortal />}

        {role === 'admin' && <AdminPortal />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Global Modals */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
        />
      )}

      {videoAppointment && (
        <VideoConsultationRoom
          appointment={videoAppointment}
          onClose={() => setVideoAppointment(null)}
        />
      )}

      <VideoModal />
      <SmartCareGuideModal />
      <PrepAssistantModal />
      <FlutterCodeViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <CareProvider>
      <MainContent />
    </CareProvider>
  );
}
