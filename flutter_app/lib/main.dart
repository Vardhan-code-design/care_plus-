import 'package:flutter/material.dart';
import 'screens/landing_screen.dart';
import 'screens/patient_dashboard.dart';
import 'screens/doctor_portal.dart';
import 'screens/admin_portal.dart';

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
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
          elevation: 0.5,
        ),
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
}
