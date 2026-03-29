import 'dart:math';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:insurance_mob/constants/enums.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:insurance_mob/providers/claim_provider.dart';
import 'package:insurance_mob/providers/document_provider.dart';
import 'package:insurance_mob/models/user_policy.dart';
import 'package:insurance_mob/providers/policy_provider.dart';
import 'package:insurance_mob/services/claimant_service.dart';
import 'package:provider/provider.dart';

class _PendingDoc {
  final String localId;
  final String name;
  final String format;
  String docType;

  _PendingDoc({
    required this.localId,
    required this.name,
    required this.format,
    this.docType = '',
  });
}

class FnolFormScreen extends StatefulWidget {
  const FnolFormScreen({super.key});

  @override
  State<FnolFormScreen> createState() => _FnolFormScreenState();
}

class _FnolFormScreenState extends State<FnolFormScreen> {
  int _step = 0;
  final _first = TextEditingController();
  final _last = TextEditingController();
  final _email = TextEditingController();
  final _phone = TextEditingController();
  String _relationship = '';
  String? _policyId;
  final _amount = TextEditingController();
  final _claimNumber = TextEditingController();
  DateTime? _lossDate;
  String _lossType = '';
  final _cause = TextEditingController();
  final _location = TextEditingController();
  final _description = TextEditingController();
  final List<_PendingDoc> _docs = [];
  bool _submitting = false;
  final _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _claimNumber.text = _genClaimNumber();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final uid = context.read<AuthProvider>().user!.id;
      await context.read<PolicyProvider>().loadUserPolicies(uid);
      setState(() {});
    });
  }

  String _genClaimNumber() {
    final y = DateTime.now().year;
    final seq = Random().nextInt(90000) + 10000;
    return 'CLM-$y-$seq';
  }

  @override
  void dispose() {
    _first.dispose();
    _last.dispose();
    _email.dispose();
    _phone.dispose();
    _amount.dispose();
    _claimNumber.dispose();
    _cause.dispose();
    _location.dispose();
    _description.dispose();
    super.dispose();
  }

  Future<void> _pick(ImageSource src) async {
    final x = await _picker.pickImage(source: src, maxWidth: 1600, imageQuality: 85);
    if (x == null) return;
    final parts = x.name.split('.');
    final ext = parts.length > 1 ? parts.last.toLowerCase() : 'jpg';
    setState(() {
      _docs.add(_PendingDoc(
        localId: Random().nextInt(1 << 32).toString(),
        name: x.name,
        format: ext,
      ));
    });
  }

  Future<void> _submit() async {
    for (final d in _docs) {
      if (d.docType.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Select document type for all files')),
        );
        return;
      }
    }
    if (_policyId == null || _lossDate == null || _lossType.isEmpty) return;

    setState(() => _submitting = true);
    try {
      final claimant = await ClaimantService().createClaimant({
        'first_name': _first.text.trim(),
        'last_name': _last.text.trim(),
        'email': _email.text.trim(),
        'phone': _phone.text.trim(),
        'relationship_to_insured': _relationship,
      });

      final claim = await context.read<ClaimProvider>().createClaim({
        'claim_number': _claimNumber.text.trim(),
        'estimated_loss_amount': double.tryParse(_amount.text) ?? 0,
        'user_policy_id': _policyId,
        'claimant_id': claimant.id,
        'loss': {
          'loss_date': _lossDate!.toIso8601String(),
          'loss_type': _lossType,
          'loss_cause': _cause.text.trim(),
          'loss_location': _location.text.trim(),
          'loss_description': _description.text.trim(),
        },
      });

      final docP = context.read<DocumentProvider>();
      for (final d in _docs) {
        await docP.upload({
          'document_name': d.name,
          'document_type': d.docType,
          'file_path': '/uploads/${claim.id}/${d.name}',
          'file_format': d.format,
          'claim_id': claim.id,
        });
      }

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Claim filed successfully')),
      );
      context.go('/portal/claims');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: List.generate(4, (i) {
              final done = i < _step;
              final act = i == _step;
              return Expanded(
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 14,
                      backgroundColor: act || done
                          ? const Color(0xFF4F46E5)
                          : Colors.grey.shade300,
                      child: Text(
                        done ? '✓' : '${i + 1}',
                        style: TextStyle(
                          fontSize: 12,
                          color: act || done ? Colors.white : Colors.grey,
                        ),
                      ),
                    ),
                    if (i < 3) Expanded(child: Divider(color: Colors.grey.shade300)),
                  ],
                ),
              );
            }),
          ),
        ),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: _stepBody(context.watch<PolicyProvider>().userPolicies),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              if (_step > 0)
                OutlinedButton(
                  onPressed: () => setState(() => _step--),
                  child: const Text('Back'),
                ),
              const Spacer(),
              if (_step < 3)
                FilledButton(
                  onPressed: () {
                    if (_step == 0 &&
                        (_first.text.isEmpty ||
                            _last.text.isEmpty ||
                            _email.text.isEmpty ||
                            _phone.text.isEmpty ||
                            _relationship.isEmpty)) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Fill all claimant fields')),
                      );
                      return;
                    }
                    if (_step == 1 &&
                        (_policyId == null || _amount.text.isEmpty)) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Select policy and amount')),
                      );
                      return;
                    }
                    if (_step == 2 &&
                        (_lossDate == null ||
                            _lossType.isEmpty ||
                            _cause.text.isEmpty ||
                            _location.text.isEmpty ||
                            _description.text.isEmpty)) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Complete loss details')),
                      );
                      return;
                    }
                    setState(() => _step++);
                  },
                  child: const Text('Next'),
                )
              else
                FilledButton(
                  onPressed: _submitting ? null : _submit,
                  child: _submitting
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Submit claim'),
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _stepBody(List<UserPolicy> policies) {
    switch (_step) {
      case 0:
        return Column(
          children: [
            TextField(
                controller: _first,
                decoration: const InputDecoration(labelText: 'First name')),
            const SizedBox(height: 8),
            TextField(
                controller: _last,
                decoration: const InputDecoration(labelText: 'Last name')),
            const SizedBox(height: 8),
            TextField(
                controller: _email,
                decoration: const InputDecoration(labelText: 'Email')),
            const SizedBox(height: 8),
            TextField(
                controller: _phone,
                decoration: const InputDecoration(labelText: 'Phone')),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _relationship.isEmpty ? null : _relationship,
              decoration: const InputDecoration(
                  labelText: 'Relationship to insured'),
              items: const [
                DropdownMenuItem(value: 'Self', child: Text('Self')),
                DropdownMenuItem(value: 'Spouse', child: Text('Spouse')),
                DropdownMenuItem(value: 'Child', child: Text('Child')),
                DropdownMenuItem(value: 'Parent', child: Text('Parent')),
                DropdownMenuItem(value: 'Other', child: Text('Other')),
              ],
              onChanged: (v) => setState(() => _relationship = v ?? ''),
            ),
          ],
        );
      case 1:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            DropdownButtonFormField<String>(
              value: _policyId,
              decoration: const InputDecoration(labelText: 'Policy'),
              items: policies
                  .map<DropdownMenuItem<String>>((p) => DropdownMenuItem(
                        value: p.id,
                        child: Text(p.policyNumber),
                      ))
                  .toList(),
              onChanged: (v) => setState(() => _policyId = v),
            ),
            const SizedBox(height: 8),
            TextField(
                controller: _claimNumber,
                decoration: const InputDecoration(labelText: 'Claim number')),
            const SizedBox(height: 8),
            TextField(
                controller: _amount,
                keyboardType: TextInputType.number,
                decoration:
                    const InputDecoration(labelText: 'Estimated loss (₹)')),
          ],
        );
      case 2:
        return Column(
          children: [
            ListTile(
              title: const Text('Loss date'),
              subtitle: Text(_lossDate?.toString().split(' ').first ?? 'Pick'),
              onTap: () async {
                final d = await showDatePicker(
                  context: context,
                  initialDate: DateTime.now(),
                  firstDate: DateTime(2000),
                  lastDate: DateTime.now(),
                );
                if (d != null) setState(() => _lossDate = d);
              },
            ),
            DropdownButtonFormField<String>(
              value: _lossType.isEmpty ? null : _lossType,
              decoration: const InputDecoration(labelText: 'Loss type'),
              items: lossTypes
                  .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                  .toList(),
              onChanged: (v) => setState(() => _lossType = v ?? ''),
            ),
            TextField(
                controller: _cause,
                decoration: const InputDecoration(labelText: 'Cause')),
            TextField(
                controller: _location,
                decoration: const InputDecoration(labelText: 'Location')),
            TextField(
                controller: _description,
                maxLines: 3,
                decoration: const InputDecoration(labelText: 'Description')),
          ],
        );
      default:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                FilledButton.tonal(
                  onPressed: () => _pick(ImageSource.camera),
                  child: const Text('Camera'),
                ),
                const SizedBox(width: 8),
                FilledButton.tonal(
                  onPressed: () => _pick(ImageSource.gallery),
                  child: const Text('Gallery'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ..._docs.map((d) => Card(
                  child: ListTile(
                    title: Text(d.name),
                    subtitle: DropdownButton<String>(
                      isExpanded: true,
                      value: d.docType.isEmpty ? null : d.docType,
                      hint: const Text('Document type'),
                      items: docTypes
                          .map((t) =>
                              DropdownMenuItem(value: t, child: Text(t)))
                          .toList(),
                      onChanged: (v) =>
                          setState(() => d.docType = v ?? d.docType),
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline),
                      onPressed: () =>
                          setState(() => _docs.remove(d)),
                    ),
                  ),
                )),
          ],
        );
    }
  }
}
