import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:insurance_mob/router/app_router.dart';

class InsuranceApp extends StatefulWidget {
  final AuthProvider auth;

  const InsuranceApp({super.key, required this.auth});

  @override
  State<InsuranceApp> createState() => _InsuranceAppState();
}

class _InsuranceAppState extends State<InsuranceApp> {
  late final GoRouter _router = createAppRouter(widget.auth);

  @override
  Widget build(BuildContext context) {
    final indigo = const Color(0xFF4F46E5);
    return MaterialApp.router(
      title: 'InsureClaim',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: indigo,
          primary: indigo,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        appBarTheme: AppBarTheme(
          backgroundColor: indigo,
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
      routerConfig: _router,
    );
  }
}
