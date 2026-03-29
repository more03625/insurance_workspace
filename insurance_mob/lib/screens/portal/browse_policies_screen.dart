import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:insurance_mob/providers/policy_provider.dart';
import 'package:insurance_mob/utils/currency_formatter.dart';
import 'package:insurance_mob/widgets/empty_state.dart';
import 'package:insurance_mob/widgets/loading_indicator.dart';
import 'package:provider/provider.dart';

class BrowsePoliciesScreen extends StatefulWidget {
  const BrowsePoliciesScreen({super.key});

  @override
  State<BrowsePoliciesScreen> createState() => _BrowsePoliciesScreenState();
}

class _BrowsePoliciesScreenState extends State<BrowsePoliciesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PolicyProvider>().loadMasters();
    });
  }

  @override
  Widget build(BuildContext context) {
    final p = context.watch<PolicyProvider>();
    return RefreshIndicator(
      onRefresh: () => context.read<PolicyProvider>().loadMasters(),
      child: p.loading && p.masters.isEmpty
          ? const LoadingIndicator(message: 'Loading policies...')
          : p.masters.isEmpty
              ? ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: const [
                    EmptyState(message: 'No policies available.'),
                  ],
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: p.masters.length,
                  itemBuilder: (context, i) {
                    final m = p.masters[i];
                    return Card(
                      child: ListTile(
                        title: Text(m.name),
                        subtitle: Text(
                            '${m.policyType} · ${formatInr(m.basePremium)}'),
                        isThreeLine: true,
                        trailing: FilledButton(
                          onPressed: () =>
                              context.go('/portal/purchase/${m.id}'),
                          child: const Text('Buy'),
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
