import 'package:flutter/material.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:insurance_mob/providers/policy_provider.dart';
import 'package:insurance_mob/utils/currency_formatter.dart';
import 'package:insurance_mob/widgets/empty_state.dart';
import 'package:insurance_mob/widgets/loading_indicator.dart';
import 'package:provider/provider.dart';

class MyPoliciesScreen extends StatefulWidget {
  const MyPoliciesScreen({super.key});

  @override
  State<MyPoliciesScreen> createState() => _MyPoliciesScreenState();
}

class _MyPoliciesScreenState extends State<MyPoliciesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final uid = context.read<AuthProvider>().user!.id;
    await context.read<PolicyProvider>().loadUserPolicies(uid);
  }

  @override
  Widget build(BuildContext context) {
    final p = context.watch<PolicyProvider>();
    return RefreshIndicator(
      onRefresh: _load,
      child: p.loading && p.userPolicies.isEmpty
          ? const LoadingIndicator()
          : p.userPolicies.isEmpty
              ? ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: const [
                    EmptyState(message: 'No policies yet. Browse and buy one!'),
                  ],
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: p.userPolicies.length,
                  itemBuilder: (context, i) {
                    final up = p.userPolicies[i];
                    return Card(
                      child: ListTile(
                        title: Text(up.policyNumber),
                        subtitle: Text(
                            '${up.status} · ${formatInr(up.premiumPaid)}'),
                      ),
                    );
                  },
                ),
    );
  }
}
