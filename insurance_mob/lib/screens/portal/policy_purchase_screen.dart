import 'dart:math';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:insurance_mob/providers/policy_provider.dart';
import 'package:insurance_mob/widgets/mock_payment_sheet.dart';
import 'package:provider/provider.dart';

class PolicyPurchaseScreen extends StatefulWidget {
  final String policyMasterId;

  const PolicyPurchaseScreen({super.key, required this.policyMasterId});

  @override
  State<PolicyPurchaseScreen> createState() => _PolicyPurchaseScreenState();
}

class _PolicyPurchaseScreenState extends State<PolicyPurchaseScreen> {
  final _premium = TextEditingController();
  DateTime? _start;
  DateTime? _end;
  String? _error;

  String _genPolicyNumber() {
    final y = DateTime.now().year;
    final seq = (Random().nextInt(90000) + 10000).toString().padLeft(5, '0');
    return 'POL-$y-$seq';
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await context.read<PolicyProvider>().loadMasters();
      final m = context
          .read<PolicyProvider>()
          .masters
          .where((x) => x.id == widget.policyMasterId)
          .firstOrNull;
      if (m != null) {
        _premium.text = m.basePremium.toStringAsFixed(0);
      }
      setState(() {});
    });
  }

  @override
  void dispose() {
    _premium.dispose();
    super.dispose();
  }

  Future<void> _paySuccess() async {
    final user = context.read<AuthProvider>().user!;
    final start = _start ?? DateTime.now();
    final end = _end ?? start.add(const Duration(days: 365));
    try {
      await context.read<PolicyProvider>().purchase({
        'policy_number': _genPolicyNumber(),
        'start_date': start.toIso8601String(),
        'end_date': end.toIso8601String(),
        'premium_paid': double.tryParse(_premium.text) ?? 0,
        'user_id': user.id,
        'policy_master_id': widget.policyMasterId,
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Policy purchased!')),
      );
      context.go('/portal/policies');
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    final masters = context.watch<PolicyProvider>().masters;
    final master = masters.where((m) => m.id == widget.policyMasterId).firstOrNull;

    return ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (master != null) ...[
            Text(master.name,
                style:
                    const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            Text(master.description),
            const SizedBox(height: 24),
          ],
          ListTile(
            title: const Text('Start date'),
            subtitle: Text(_start?.toString().split(' ').first ?? 'Tap to pick'),
            trailing: const Icon(Icons.calendar_today),
            onTap: () async {
              final d = await showDatePicker(
                context: context,
                initialDate: DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime(2100),
              );
              if (d != null) setState(() => _start = d);
            },
          ),
          ListTile(
            title: const Text('End date'),
            subtitle: Text(_end?.toString().split(' ').first ?? 'Tap to pick'),
            trailing: const Icon(Icons.calendar_today),
            onTap: () async {
              final d = await showDatePicker(
                context: context,
                initialDate: _start?.add(const Duration(days: 365)) ?? DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime(2100),
              );
              if (d != null) setState(() => _end = d);
            },
          ),
          TextField(
            controller: _premium,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Premium paid (₹)'),
          ),
          if (_error != null)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(_error!, style: const TextStyle(color: Colors.red)),
            ),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: () {
              MockPaymentSheet.show(
                context,
                title: 'Mock payment gateway',
                subtitle: 'Choose outcome for demo',
                onSuccess: _paySuccess,
                onFailure: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Payment failed (demo)')),
                  );
                },
              );
            },
            child: const Text('Continue to payment'),
          ),
        ],
    );
  }
}

extension<T> on Iterable<T> {
  T? get firstOrNull {
    final i = iterator;
    return i.moveNext() ? i.current : null;
  }
}
