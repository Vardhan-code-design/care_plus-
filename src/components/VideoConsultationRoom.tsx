import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  FileText,
  Send,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';
import { Appointment } from '../types';
import { useCare } from '../context/CareContext';

interface VideoConsultationRoomProps {
  appointment: Appointment;
  onClose: () => void;
}

export const VideoConsultationRoom: React.FC<VideoConsultationRoomProps> = ({
  appointment,
  onClose,
}) => {
  const { role, completeAppointment, currentPatient, currentDoctor } = useCare();

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(240); // 4 mins
  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string; time: string }[]
  >([
    {
      sender: appointment.doctorName,
      text: `Hello ${appointment.patientName}, I have reviewed your preliminary symptoms note. How are you feeling today?`,
      time: '10:02 AM',
    },
    {
      sender: appointment.patientName,
      text: 'Good morning Doctor. The dizziness has been recurring for two days, mostly in the morning.',
      time: '10:03 AM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [consultationNotes, setConsultationNotes] = useState(
    appointment.consultationNotes ||
      'Patient reports intermittent morning postural dizziness. Vitals stable. Advised routine electrolytes and hydration.'
  );
  const [prescriptionText, setPrescriptionText] = useState(
    appointment.prescription ||
      '1. Tab Betahistine 16mg BD after meals x 5 days\n2. Tab Neurobion Forte OD x 15 days\n3. Adequate hydration (3L/day)'
  );
  const [isCompleted, setIsCompleted] = useState(appointment.status === 'completed');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sender = role === 'doctor' ? appointment.doctorName : appointment.patientName;
    setChatMessages((prev) => [...prev, { sender, text: newMessage.trim(), time: now }]);
    setNewMessage('');
  };

  const handleFinishConsultation = () => {
    completeAppointment(appointment.id, consultationNotes, prescriptionText);
    setIsCompleted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 rounded-3xl max-w-5xl w-full h-[90vh] overflow-hidden shadow-2xl border border-slate-800 flex flex-col text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">{appointment.doctorName}</h3>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-sky-400">{appointment.doctorSpecialty}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Patient: {appointment.patientName} ({appointment.timeSlot})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Call duration timer */}
            <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1 rounded-xl text-xs font-mono tabular-nums text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-bit Encrypted</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Middle Stage: Video feeds (Left) & Clinical Notes / Chat (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-900">
          {/* Video Stream Area (7 cols on lg) */}
          <div className="lg:col-span-7 p-4 flex flex-col justify-between relative bg-black/60">
            {/* Main Stage: Doctor Video Feed */}
            <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img
                src="/src/assets/images/care_telehealth_1791914439652.jpg"
                alt="Doctor Video Stream"
                className={`w-full h-full object-cover transition-all ${
                  videoOn ? 'filter brightness-95' : 'filter brightness-20 blur-xs'
                }`}
                referrerPolicy="no-referrer"
              />

              {!videoOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <VideoOff className="w-12 h-12 mb-2" />
                  <span className="text-xs">Camera is paused</span>
                </div>
              )}

              {/* Doctor Label overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{appointment.doctorName} (Host)</span>
              </div>

              {/* Picture-in-Picture: Patient Feed */}
              <div className="absolute top-3 right-3 w-28 sm:w-36 aspect-4/3 rounded-xl overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-xl flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <div className="w-10 h-10 rounded-full bg-sky-700 flex items-center justify-center text-white text-xs font-bold mb-1">
                    {appointment.patientName.charAt(0)}
                  </div>
                  <span className="text-[10px] text-slate-300 truncate max-w-[90px]">
                    {appointment.patientName}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom In-call Control Strip */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
                title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  videoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
                title={videoOn ? 'Turn Video Off' : 'Turn Video On'}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Leave Session</span>
              </button>
            </div>
          </div>

          {/* Clinical Notes & Prescription / In-call Chat (5 cols on lg) */}
          <div className="lg:col-span-5 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-full overflow-hidden">
            {/* Top tab headers */}
            <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-sky-400">Clinical Consultation Notes</span>
              {isCompleted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Prescription Issued
                </span>
              ) : (
                <span className="text-amber-400 font-medium">Session in progress</span>
              )}
            </div>

            {/* Scrollable notes & chat */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {/* Patient Vitals Summary */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  Patient Health Context
                </div>
                <div className="text-slate-200">
                  <strong>Reason:</strong> {appointment.reason}
                </div>
                {appointment.symptoms && (
                  <div className="text-slate-300">
                    <strong>Symptoms:</strong> {appointment.symptoms}
                  </div>
                )}
              </div>

              {/* Real Doctor Prescription Notepad */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Prescription & Treatment Orders:
                </label>
                <textarea
                  rows={4}
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  placeholder="Enter medications, dosage, duration, and lifestyle instructions..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Consultation Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Physician Assessment Notes:
                </label>
                <textarea
                  rows={3}
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Clinical assessment observations..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Finish / Sign off button */}
              <div className="pt-1">
                <button
                  onClick={handleFinishConsultation}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isCompleted ? 'Prescription Generated & Saved' : 'Complete Consultation & Issue Rx'}
                  </span>
                </button>
              </div>

              {/* In-Call Discussion Chat */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Encrypted In-Session Chat
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-xl text-[11px] ${
                        msg.sender === appointment.doctorName
                          ? 'bg-sky-950/80 border border-sky-800/60 text-sky-200 ml-3'
                          : 'bg-slate-800 text-slate-200 mr-3'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                        <span className="font-semibold">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Send message during call..."
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
