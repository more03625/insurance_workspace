import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:insurance_mob/constants/enums.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:insurance_mob/providers/claim_provider.dart';
import 'package:insurance_mob/providers/policy_provider.dart';
import 'package:insurance_mob/utils/currency_formatter.dart';
import 'package:insurance_mob/widgets/empty_state.dart';
import 'package:insurance_mob/widgets/loading_indicator.dart';
import 'package:insurance_mob/widgets/stat_card.dart';
import 'package:insurance_mob/widgets/status_badge.dart';
import 'package:provider/provider.dart';

class PortalDashboardScreen extends StatefulWidget {
  const PortalDashboardScreen({super.key});

  @override
  State<PortalDashboardScreen> createState() => _PortalDashboardScreenState();
}

class _PortalDashboardScreenState extends State<PortalDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final user = context.read<AuthProvider>().user!;
    await Future.wait([
      context.read<PolicyProvider>().loadUserPolicies(user.id),
      context.read<ClaimProvider>().loadClaims(),
    ]);
  }

  bool _isSubmitted(String s) =>
      s.toLowerCase().replaceAll(' ', '_') == ClaimStatuses.submitted;

  bool _isResolved(String s) {
    final x = s.toLowerCase().replaceAll(' ', '_');
    return ['verified', 'approved', 'settled'].contains(x);
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user!;
    final policies = context.watch<PolicyProvider>();
    final claimsP = context.watch<ClaimProvider>();
    final policyIds =
        policies.userPolicies.map((p) => p.id).toSet();
    final myClaims =
        claimsP.claims.where((c) => policyIds.contains(c.userPolicyId)).toList();
    final submitted = myClaims.where((c) => _isSubmitted(c.claimStatus)).length;
    final resolved = myClaims.where((c) => _isResolved(c.claimStatus)).length;

    return RefreshIndicator(
      onRefresh: _load,
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Welcome, ${user.firstName}!',
                            style: const TextStyle(
                                fontSize: 22, fontWeight: FontWeight.bold)),
                        Text('Your insurance overview',
                            style: TextStyle(color: Colors.grey.shade600)),
                      ],
                    ),
                  ),
                  FilledButton.icon(
                    onPressed: () => context.go('/portal/fnol'),
                    icon: const Icon(Icons.add, size: 20),
                    label: const Text('File claim'),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverToBoxAdapter(
              child: claimsP.loading || policies.loading
                  ? const LoadingIndicator()
                  : Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: StatCard(
                                label: 'My policies',
                                value: '${policies.userPolicies.length}',
                                color: Colors.indigo,
                                icon: Icons.shield_outlined,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: StatCard(
                                label: 'Open claims',
                                value: '$submitted',
                                color: Colors.blue,
                                icon: Icons.inbox_outlined,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: StatCard(
                                label: 'Resolved',
                                value: '$resolved',
                                color: Colors.green,
                                icon: Icons.check_circle_outline,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        const Align(
                          alignment: Alignment.centerLeft,
                          child: Text('Recent claims',
                              style: TextStyle(
                                  fontSize: 18, fontWeight: FontWeight.w600)),
                        ),
                        const SizedBox(height: 8),
                      ],
                    ),
            ),
          ),
          if (myClaims.isEmpty && !claimsP.loading)
            const SliverFillRemaining(
              hasScrollBody: false,
              child: EmptyState(
                  message: 'You haven\'t filed any claims yet.'),
            )
          else
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, i) {
                  final c = myClaims[i];
                  return ListTile(
                    title: Text(c.claimNumber),
                    subtitle: Text(formatInr(c.estimatedLossAmount)),
                    trailing: StatusBadge(status: c.claimStatus),
                    onTap: () => context.go('/portal/claims/${c.id}'),
                  );
                },
                childCount: myClaims.length > 10 ? 10 : myClaims.length,
              ),
            ),
        ],
      ),
    );
  }
}
