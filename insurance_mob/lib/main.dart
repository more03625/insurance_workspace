import 'package:flutter/material.dart';
import 'package:insurance_mob/app.dart';
import 'package:insurance_mob/constants/api_constants.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:insurance_mob/providers/claim_provider.dart';
import 'package:insurance_mob/providers/document_provider.dart';
import 'package:insurance_mob/providers/policy_provider.dart';
import 'package:insurance_mob/services/api_client.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  ApiClient.instance.init(baseUrl: kDefaultApiBaseUrl);

  final auth = AuthProvider();
  await auth.loadSession();
  auth.registerApiHooks();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthProvider>.value(value: auth),
        ChangeNotifierProvider(create: (_) => PolicyProvider()),
        ChangeNotifierProvider(create: (_) => ClaimProvider()),
        ChangeNotifierProvider(create: (_) => DocumentProvider()),
      ],
      child: InsuranceApp(auth: auth),
    ),
  );
}
