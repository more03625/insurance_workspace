import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:insurance_mob/screens/admin/admin_dashboard_screen.dart';
import 'package:insurance_mob/screens/admin/claims_list_screen.dart';
import 'package:insurance_mob/screens/admin/policy_management_screen.dart';
import 'package:insurance_mob/screens/admin/surveyor_dashboard_screen.dart';
import 'package:insurance_mob/screens/admin/user_management_screen.dart';
import 'package:insurance_mob/screens/claim_detail_screen.dart';
import 'package:insurance_mob/screens/login_screen.dart';
import 'package:insurance_mob/screens/signup_screen.dart';
import 'package:insurance_mob/screens/portal/browse_policies_screen.dart';
import 'package:insurance_mob/screens/portal/fnol_form_screen.dart';
import 'package:insurance_mob/screens/portal/my_claims_screen.dart';
import 'package:insurance_mob/screens/portal/my_policies_screen.dart';
import 'package:insurance_mob/screens/portal/policy_purchase_screen.dart';
import 'package:insurance_mob/screens/portal/portal_dashboard_screen.dart';
import 'package:insurance_mob/widgets/app_drawer.dart';

GoRouter createAppRouter(AuthProvider auth) {
  return GoRouter(
    initialLocation: '/login',
    refreshListenable: auth,
    redirect: (BuildContext context, GoRouterState state) {
      final loc = state.matchedLocation;
      final loggedIn = auth.isLoggedIn;
      final loggingIn = loc == '/login' || loc == '/signup';

      if (!loggedIn && !loggingIn) return '/login';
      if (loggedIn && loggingIn) {
        return auth.isPolicyholder ? '/portal' : '/admin';
      }
      if (loggedIn && loc.startsWith('/portal') && !auth.isPolicyholder) {
        return '/admin';
      }
      if (loggedIn && loc.startsWith('/admin') && auth.isPolicyholder) {
        return '/portal';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (c, s) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (c, s) => const SignupScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) {
          final user = auth.user;
          if (user == null) return const SizedBox.shrink();
          return Scaffold(
            appBar: AppBar(
              title: const Text('InsureClaim'),
              backgroundColor: const Color(0xFF4F46E5),
              foregroundColor: Colors.white,
            ),
            drawer: PortalDrawer(user: user),
            body: child,
          );
        },
        routes: [
          GoRoute(
            path: '/portal',
            builder: (c, s) => const PortalDashboardScreen(),
          ),
          GoRoute(
            path: '/portal/browse',
            builder: (c, s) => const BrowsePoliciesScreen(),
          ),
          GoRoute(
            path: '/portal/purchase/:id',
            builder: (c, s) => PolicyPurchaseScreen(
              policyMasterId: s.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/portal/policies',
            builder: (c, s) => const MyPoliciesScreen(),
          ),
          GoRoute(
            path: '/portal/fnol',
            builder: (c, s) => const FnolFormScreen(),
          ),
          GoRoute(
            path: '/portal/claims',
            builder: (c, s) => const MyClaimsScreen(),
          ),
          GoRoute(
            path: '/portal/claims/:id',
            builder: (c, s) => ClaimDetailScreen(claimId: s.pathParameters['id']!),
          ),
        ],
      ),
      ShellRoute(
        builder: (context, state, child) {
          final user = auth.user;
          if (user == null) return const SizedBox.shrink();
          return Scaffold(
            appBar: AppBar(
              title: const Text('InsureClaim Admin'),
              backgroundColor: const Color(0xFF4F46E5),
              foregroundColor: Colors.white,
            ),
            drawer: AdminDrawer(user: user),
            body: child,
          );
        },
        routes: [
          GoRoute(
            path: '/admin',
            builder: (c, s) => const AdminDashboardScreen(),
          ),
          GoRoute(
            path: '/admin/claims',
            builder: (c, s) => const ClaimsListScreen(),
          ),
          GoRoute(
            path: '/admin/claims/:id',
            builder: (c, s) => ClaimDetailScreen(claimId: s.pathParameters['id']!),
          ),
          GoRoute(
            path: '/admin/surveyor',
            builder: (c, s) => const SurveyorDashboardScreen(),
          ),
          GoRoute(
            path: '/admin/policies',
            builder: (c, s) => const PolicyManagementScreen(),
          ),
          GoRoute(
            path: '/admin/users',
            builder: (c, s) => const UserManagementScreen(),
          ),
        ],
      ),
    ],
  );
}
