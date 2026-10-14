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
  final double fee; // in INR
  final String availabilityStatus;
  final String verificationStatus;
  final bool requiresDoctorApproval;
  final String bio;
  final String hospitalAffiliation;
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
    required this.bio,
    required this.hospitalAffiliation,
    required this.timeSlots,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      avatar: json['avatar'] ?? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      specialty: json['specialty'] ?? '',
      qualifications: json['qualifications'] ?? '',
      registrationNumber: json['registration_number'] ?? '',
      experienceYears: json['experience_years'] ?? 5,
      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
      reviewCount: json['review_count'] ?? 0,
      fee: (json['fee'] as num?)?.toDouble() ?? 800.0,
      availabilityStatus: json['availability_status'] ?? 'Available Today',
      verificationStatus: json['verification_status'] ?? 'verified',
      requiresDoctorApproval: json['requires_doctor_approval'] ?? false,
      bio: json['bio'] ?? '',
      hospitalAffiliation: json['hospital_affiliation'] ?? 'Care+ Network',
      timeSlots: List<String>.from(json['time_slots'] ?? ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM']),
    );
  }
}
