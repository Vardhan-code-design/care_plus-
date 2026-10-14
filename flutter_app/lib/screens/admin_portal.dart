import 'package:flutter/material.dart';

class AdminPortalScreen extends StatelessWidget {
  const AdminPortalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Management & Verification Portal'),
      ),
      body: const Center(
        child: Text('Doctor Verification & Audit Logs (Flutter UI)'),
      ),
    );
  }
}
