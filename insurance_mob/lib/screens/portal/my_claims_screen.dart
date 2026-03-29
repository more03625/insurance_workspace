import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:insurance_mob/providers/claim_provider.dart';
import 'package:insurance_mob/providers/policy_provider.dart';
import 'package:insurance_mob/utils/currency_formatter.dart';
import 'package:insurance_mob/widgets/empty_state.dart';
import 'package:insurance_mob/widgets/loading_indicator.dart';
import 'package:insurance_mob/widgets/status_badge.dart';
import 'package:provider/provider.dart';

class MyClaimsScreen extends StatefulWidget {
  const MyClaimsScreen({super.key});

  @override
  State<MyClaimsScreen> createState() => _MyClaimsScreenState();
}

class _MyClaimsScreenState extends State<MyClaimsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final uid = context.read<AuthProvider>().user!.id;
    await Future.wait([
      context.read<PolicyProvider>().loadUserPolicies(uid),
      context.read<ClaimProvider>().loadClaims(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    final policies = context.watch<PolicyProvider>();
    final claimsP = context.watch<ClaimProvider>();
    final ids = policies.userPolicies.map((p) => p.id).toSet();
    final mine = claimsP.claims.where((c) => ids.contains(c.userPolicyId)).toList();

    return RefreshIndicator(
      onRefresh: _load,
      child: claimsP.loading && mine.isEmpty
          ? const LoadingIndicator()
          : mine.isEmpty
              ? ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: const [
                    EmptyState(message: 'No claims filed yet.'),
                  ],
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: mine.length,
                  itemBuilder: (context, i) {
                    final c = mine[i];
                    return Card(
                      child: ListTile(
                        title: Text(c.claimNumber),
                        subtitle: Text(formatInr(c.estimatedLossAmount)),
                        trailing: StatusBadge(status: c.claimStatus),
                        onTap: () => context.go('/portal/claims/${c.id}'),
                      ),
                    );
                  },
                ),
    );
  }
}
