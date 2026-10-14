import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/doctor.dart';
import '../models/appointment.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8000/api'; // Android emulator / localhost

  static Future<List<Doctor>> getDoctors({String? specialty}) async {
    final uri = Uri.parse('/doctors/').replace(
      queryParameters: specialty != null && specialty.isNotEmpty ? {'specialty': specialty} : null,
    );
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      final List data = jsonDecode(res.body);
      return data.map((e) => Doctor.fromJson(e)).toList();
    }
    throw Exception('Failed to load doctors: ${res.statusCode}');
  }

  static Future<Map<String, dynamic>> bookAppointment({
    required String doctorId,
    required String date,
    required String timeSlot,
    required String type,
    required String reason,
    String? symptoms,
  }) async {
    final res = await http.post(
      Uri.parse('/appointments/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'doctor_id': doctorId,
        'date': date,
        'time_slot': timeSlot,
        'consultation_type': type,
        'reason': reason,
        'symptoms': symptoms ?? '',
      }),
    );
    return jsonDecode(res.body);
  }
}
