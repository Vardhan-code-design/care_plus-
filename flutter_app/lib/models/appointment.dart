class Appointment {
  final String id;
  final String patientId;
  final String patientName;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialty;
  final String date;
  final String timeSlot;
  final String type; // 'video' or 'in_clinic'
  final String status; // 'pending', 'confirmed', 'completed', 'cancelled'
  final double fee;
  final String reason;
  final String? symptoms;
  final String? prescription;

  Appointment({
    required this.id,
    required this.patientId,
    required this.patientName,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialty,
    required this.date,
    required this.timeSlot,
    required this.type,
    required this.status,
    required this.fee,
    required this.reason,
    this.symptoms,
    this.prescription,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id']?.toString() ?? '',
      patientId: json['patient_id']?.toString() ?? '',
      patientName: json['patient_name'] ?? '',
      doctorId: json['doctor_id']?.toString() ?? '',
      doctorName: json['doctor_name'] ?? '',
      doctorSpecialty: json['doctor_specialty'] ?? '',
      date: json['date'] ?? '',
      timeSlot: json['time_slot'] ?? '',
      type: json['consultation_type'] ?? 'video',
      status: json['status'] ?? 'pending',
      fee: (json['fee'] as num?)?.toDouble() ?? 800.0,
      reason: json['reason'] ?? '',
      symptoms: json['symptoms'],
      prescription: json['prescription'],
    );
  }
}
