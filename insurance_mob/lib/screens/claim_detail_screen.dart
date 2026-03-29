import 'package:flutter/material.dart';
import 'package:insurance_mob/models/claim.dart';
import 'package:insurance_mob/providers/claim_provider.dart';
import 'package:insurance_mob/utils/currency_formatter.dart';
import 'package:insurance_mob/widgets/loading_indicator.dart';
import 'package:insurance_mob/widgets/status_badge.dart';
import 'package:provider/provider.dart';

class ClaimDetailScreen extends StatefulWidget {
  final String claimId;

  const ClaimDetailScreen({super.key, required this.claimId});

  @override
  State<ClaimDetailScreen> createState() => _ClaimDetailScreenState();
}

class _ClaimDetailScreenState extends State<ClaimDetailScreen> {
  Claim? _claim;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    if (!mounted) return;
    setState(() => _loading = true);
    await context.read<ClaimProvider>().loadClaims();
    if (!mounted) return;
    final list = context.read<ClaimProvider>().claims;
    Claim? found;
    for (final c in list) {
      if (c.id == widget.claimId) {
        found = c;
        break;
      }
    }
    if (!mounted) return;
    setState(() {
      _claim = found;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const LoadingIndicator();
    final c = _claim;
    if (c == null) {
      return const Center(child: Text('Claim not found'));
    }
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          Text(c.claimNumber,
              style:
                  const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          StatusBadge(status: c.claimStatus),
          const SizedBox(height: 16),
          _row('Amount', formatInr(c.estimatedLossAmount)),
          _row('Filed', c.createdAt.toString().split('.').first),
          if (c.claimant != null) ...[
            const Divider(),
            const Text('Claimant',
                style: TextStyle(fontWeight: FontWeight.w600)),
            _row('Name', c.claimant!.fullName),
            _row('Email', c.claimant!.email),
          ],
          if (c.loss != null) ...[
            const Divider(),
            const Text('Loss', style: TextStyle(fontWeight: FontWeight.w600)),
            _row('Type', c.loss!.lossType),
            _row('Location', c.loss!.lossLocation),
          ],
        ],
      ),
    );
  }

  Widget _row(String k, String v) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(k, style: TextStyle(color: Colors.grey.shade600)),
          ),
          Expanded(child: Text(v)),
        ],
      ),
    );
  }
}
