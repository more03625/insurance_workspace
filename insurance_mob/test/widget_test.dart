import 'package:flutter_test/flutter_test.dart';
import 'package:insurance_mob/app.dart';
import 'package:insurance_mob/constants/api_constants.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:insurance_mob/services/api_client.dart';

void main() {
  testWidgets('App builds', (WidgetTester tester) async {
    ApiClient.instance.init(baseUrl: kDefaultApiBaseUrl);
    final auth = AuthProvider();
    await auth.loadSession();
    auth.registerApiHooks();
    await tester.pumpWidget(InsuranceApp(auth: auth));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('InsureClaim'), findsWidgets);
  });
}
