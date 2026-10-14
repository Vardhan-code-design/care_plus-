import 'package:flutter/material.dart';

class DoctorPortalScreen extends StatelessWidget {
  const DoctorPortalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Doctor Portal - Dr. Arvind Sharma'),
      ),
      body: const Center(
        child: Text('Doctor Schedule & Appointment Management (Flutter UI)'),
      ),
    );
  }
}
