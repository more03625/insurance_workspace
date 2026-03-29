import 'dart:math';

import 'package:flutter/material.dart';
import 'package:insurance_mob/constants/enums.dart';
import 'package:insurance_mob/models/user.dart';
import 'package:insurance_mob/providers/policy_provider.dart';
import 'package:insurance_mob/services/user_service.dart';
import 'package:insurance_mob/utils/currency_formatter.dart';
import 'package:insurance_mob/widgets/loading_indicator.dart';
import 'package:provider/provider.dart';

class PolicyManagementScreen extends StatefulWidget {
  const PolicyManagementScreen({super.key});

  @override
  State<PolicyManagementScreen> createState() => _PolicyManagementScreenState();
}

class _PolicyManagementScreenState extends State<PolicyManagementScreen> {
  List<User> _users = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    await context.read<PolicyProvider>().loadMasters();
    try {
      final u = await UserService().listUsers();
      setState(() => _users = u);
    } catch (_) {
      setState(() => _users = []);
    }
  }

  String _genPol() {
    final y = DateTime.now().year;
    final seq = (Random().nextInt(99999) + 1).toString().padLeft(5, '0');
    return 'POL-$y-$seq';
  }

  @override
  Widget build(BuildContext context) {
    final p = context.watch<PolicyProvider>();
    final holders =
        _users.where((u) => u.role == UserRoles.policyholder).toList();

    return RefreshIndicator(
      onRefresh: _load,
      child: p.loading && p.masters.isEmpty
          ? const LoadingIndicator()
          : ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              children: [
                Row(
                  children: [
                    FilledButton(
                      onPressed: () => _showCreate(context),
                      child: const Text('New policy master'),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton(
                      onPressed: () => _showPurchase(context, holders, p),
                      child: const Text('Purchase for user'),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...p.masters.map((m) => Card(
                      child: ListTile(
                        title: Text(m.name),
                        subtitle: Text(m.description),
                        trailing: Text(formatInr(m.basePremium)),
                      ),
                    )),
              ],
            ),
    );
  }

  Future<void> _showCreate(BuildContext context) async {
    final name = TextEditingController();
    final desc = TextEditingController();
    final type = TextEditingController();
    final prem = TextEditingController();
    final cov = TextEditingController();
    await showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Create policy master'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                  controller: name,
                  decoration: const InputDecoration(labelText: 'Name')),
              TextField(
                  controller: desc,
                  decoration: const InputDecoration(labelText: 'Description')),
              TextField(
                  controller: type,
                  decoration: const InputDecoration(labelText: 'Type')),
              TextField(
                  controller: prem,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Base premium')),
              TextField(
                  controller: cov,
                  maxLines: 2,
                  decoration:
                      const InputDecoration(labelText: 'Coverage details')),
            ],
          ),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () async {
              try {
                await context.read<PolicyProvider>().createMaster({
                  'name': name.text,
                  'description': desc.text,
                  'policy_type': type.text,
                  'base_premium': double.tryParse(prem.text) ?? 0,
                  'coverage_details': cov.text,
                });
                if (ctx.mounted) Navigator.pop(ctx);
                await _load();
              } catch (e) {
                if (ctx.mounted) {
                  ScaffoldMessenger.of(ctx).showSnackBar(
                    SnackBar(content: Text(e.toString())),
                  );
                }
              }
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }

  Future<void> _showPurchase(
    BuildContext context,
    List<User> holders,
    PolicyProvider p,
  ) async {
    String? uid;
    String? mid;
    final pol = TextEditingController(text: _genPol());
    DateTime? start;
    DateTime? end;
    final prem = TextEditingController();

    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setS) => AlertDialog(
          title: const Text('Purchase policy'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButtonFormField<String>(
                  value: uid,
                  decoration: const InputDecoration(labelText: 'User'),
                  items: holders
                      .map((u) => DropdownMenuItem(
                            value: u.id,
                            child: Text(u.username),
                          ))
                      .toList(),
                  onChanged: (v) => setS(() => uid = v),
                ),
                DropdownButtonFormField<String>(
                  value: mid,
                  decoration: const InputDecoration(labelText: 'Policy'),
                  items: p.masters
                      .map((m) => DropdownMenuItem(
                            value: m.id,
                            child: Text(m.name),
                          ))
                      .toList(),
                  onChanged: (v) => setS(() => mid = v),
                ),
                TextField(
                    controller: pol,
                    decoration: const InputDecoration(labelText: 'Policy #')),
                ListTile(
                  title: const Text('Start'),
                  subtitle: Text(start?.toString().split(' ').first ?? 'Pick'),
                  onTap: () async {
                    final d = await showDatePicker(
                      context: ctx,
                      initialDate: DateTime.now(),
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2100),
                    );
                    if (d != null) setS(() => start = d);
                  },
                ),
                ListTile(
                  title: const Text('End'),
                  subtitle: Text(end?.toString().split(' ').first ?? 'Pick'),
                  onTap: () async {
                    final d = await showDatePicker(
                      context: ctx,
                      initialDate: start?.add(const Duration(days: 365)) ??
                          DateTime.now(),
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2100),
                    );
                    if (d != null) setS(() => end = d);
                  },
                ),
                TextField(
                    controller: prem,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Premium')),
              ],
            ),
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Cancel')),
            FilledButton(
              onPressed: () async {
                if (uid == null || mid == null || start == null || end == null) {
                  return;
                }
                try {
                  await p.purchase({
                    'policy_number': pol.text,
                    'start_date': start!.toIso8601String(),
                    'end_date': end!.toIso8601String(),
                    'premium_paid': double.tryParse(prem.text) ?? 0,
                    'user_id': uid,
                    'policy_master_id': mid,
                  });
                  if (ctx.mounted) Navigator.pop(ctx);
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Purchased')),
                    );
                  }
                } catch (e) {
                  if (ctx.mounted) {
                    ScaffoldMessenger.of(ctx).showSnackBar(
                      SnackBar(content: Text(e.toString())),
                    );
                  }
                }
              },
              child: const Text('Purchase'),
            ),
          ],
        ),
      ),
    );
  }
}
