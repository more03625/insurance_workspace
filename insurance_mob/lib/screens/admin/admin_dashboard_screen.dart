import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:insurance_mob/constants/enums.dart';
import 'package:insurance_mob/providers/claim_provider.dart';
import 'package:insurance_mob/providers/policy_provider.dart';
import 'package:insurance_mob/utils/currency_formatter.dart';
import 'package:insurance_mob/widgets/loading_indicator.dart';
import 'package:insurance_mob/widgets/stat_card.dart';
import 'package:insurance_mob/widgets/status_badge.dart';
import 'package:provider/provider.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    await Future.wait([
      context.read<ClaimProvider>().loadClaims(),
      context.read<PolicyProvider>().loadMasters(),
    ]);
  }

  bool _submitted(String s) =>
      s.toLowerCase().replaceAll(' ', '_') == ClaimStatuses.submitted;

  @override
  Widget build(BuildContext context) {
    final claims = context.watch<ClaimProvider>();
    final pol = context.watch<PolicyProvider>();

    return RefreshIndicator(
      onRefresh: _load,
      child: claims.loading && claims.claims.isEmpty
          ? const LoadingIndicator()
          : CustomScrollView(
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverToBoxAdapter(
                    child: Row(
                      children: [
                        Expanded(
                          child: StatCard(
                            label: 'Total claims',
                            value: '${claims.claims.length}',
                            color: Colors.indigo,
                            icon: Icons.receipt_long,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: StatCard(
                            label: 'Submitted',
                            value:
                                '${claims.claims.where((c) => _submitted(c.claimStatus)).length}',
                            color: Colors.blue,
                            icon: Icons.inbox,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: StatCard(
                            label: 'Policies',
                            value: '${pol.masters.length}',
                            color: Colors.teal,
                            icon: Icons.policy,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Text('Recent claims',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w600)),
                  ),
                ),
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, i) {
                      final cl = claims.claims[i];
                      return ListTile(
                        title: Text(cl.claimNumber),
                        subtitle: Text(formatInr(cl.estimatedLossAmount)),
                        trailing: StatusBadge(status: cl.claimStatus),
                        onTap: () => context.go('/admin/claims/${cl.id}'),
                      );
                    },
                    childCount: claims.claims.length > 10
                        ? 10
                        : claims.claims.length,
                  ),
                ),
              ],
            ),
    );
  }
}
