import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:insurance_mob/providers/claim_provider.dart';
import 'package:insurance_mob/utils/currency_formatter.dart';
import 'package:insurance_mob/widgets/empty_state.dart';
import 'package:insurance_mob/widgets/loading_indicator.dart';
import 'package:insurance_mob/widgets/status_badge.dart';
import 'package:provider/provider.dart';

class ClaimsListScreen extends StatefulWidget {
  const ClaimsListScreen({super.key});

  @override
  State<ClaimsListScreen> createState() => _ClaimsListScreenState();
}

class _ClaimsListScreenState extends State<ClaimsListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ClaimProvider>().loadClaims();
    });
  }

  @override
  Widget build(BuildContext context) {
    final c = context.watch<ClaimProvider>();
    return RefreshIndicator(
      onRefresh: () => context.read<ClaimProvider>().loadClaims(),
      child: c.loading && c.claims.isEmpty
          ? const LoadingIndicator()
          : c.claims.isEmpty
              ? ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: const [
                    EmptyState(message: 'No claims.'),
                  ],
                )
              : ListView.builder(
                  itemCount: c.claims.length,
                  itemBuilder: (context, i) {
                    final cl = c.claims[i];
                    final name = cl.claimant?.fullName ?? '—';
                    final email = cl.claimant?.email ?? '—';
                    return ListTile(
                      title: Text(cl.claimNumber),
                      subtitle: Text('$name\n$email',
                          maxLines: 2, overflow: TextOverflow.ellipsis),
                      isThreeLine: true,
                      trailing: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          StatusBadge(status: cl.claimStatus),
                          Text(formatInr(cl.estimatedLossAmount),
                              style: const TextStyle(fontSize: 12)),
                        ],
                      ),
                      onTap: () => context.go('/admin/claims/${cl.id}'),
                    );
                  },
                ),
    );
  }
}
