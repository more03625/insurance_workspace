import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:insurance_mob/constants/enums.dart';
import 'package:insurance_mob/models/claim.dart';
import 'package:insurance_mob/models/document.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:insurance_mob/providers/claim_provider.dart';
import 'package:insurance_mob/providers/document_provider.dart';
import 'package:insurance_mob/utils/currency_formatter.dart';
import 'package:insurance_mob/widgets/empty_state.dart';
import 'package:insurance_mob/widgets/loading_indicator.dart';
import 'package:insurance_mob/widgets/status_badge.dart';
import 'package:provider/provider.dart';

class SurveyorDashboardScreen extends StatefulWidget {
  const SurveyorDashboardScreen({super.key});

  @override
  State<SurveyorDashboardScreen> createState() =>
      _SurveyorDashboardScreenState();
}

class _SurveyorDashboardScreenState extends State<SurveyorDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ClaimProvider>().loadClaims();
    });
  }

  Future<void> _openReview(Claim c) async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (sheetCtx) {
        return _SurveyorReviewModal(initialClaim: c);
      },
    );
    if (mounted) await context.read<ClaimProvider>().loadClaims();
  }

  String _claimantName(Claim c) {
    final cl = c.claimant;
    if (cl == null) return '—';
    return cl.fullName.isEmpty ? '—' : cl.fullName;
  }

  @override
  Widget build(BuildContext context) {
    final claims = context.watch<ClaimProvider>();
    return RefreshIndicator(
      onRefresh: () => context.read<ClaimProvider>().loadClaims(),
      child: claims.loading && claims.claims.isEmpty
          ? const LoadingIndicator()
          : claims.claims.isEmpty
              ? ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: const [
                    EmptyState(message: 'No claims to review.'),
                  ],
                )
              : ListView.builder(
                  itemCount: claims.claims.length,
                  itemBuilder: (context, i) {
                    final c = claims.claims[i];
                    return Card(
                      margin: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 6),
                      child: ListTile(
                        title: Text(c.claimNumber),
                        subtitle: Text(
                          '${_claimantName(c)}\n${c.claimant?.email ?? '—'}',
                          maxLines: 2,
                        ),
                        isThreeLine: true,
                        trailing: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            StatusBadge(status: c.claimStatus),
                            TextButton(
                              onPressed: () => _openReview(c),
                              child: const Text('Review'),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}

class _SurveyorReviewModal extends StatefulWidget {
  final Claim initialClaim;

  const _SurveyorReviewModal({required this.initialClaim});

  @override
  State<_SurveyorReviewModal> createState() => _SurveyorReviewModalState();
}

class _SurveyorReviewModalState extends State<_SurveyorReviewModal> {
  late Claim _claim;
  List<DocumentModel> _docs = [];
  bool _loadingDocs = true;
  String _statusPick = '';
  bool _submitting = false;
  final _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _claim = widget.initialClaim;
    _loadDocs();
  }

  Future<void> _loadDocs() async {
    setState(() => _loadingDocs = true);
    try {
      final list = await context.read<DocumentProvider>().getByClaim(_claim.id);
      setState(() => _docs = list);
    } catch (_) {
      setState(() => _docs = []);
    } finally {
      setState(() => _loadingDocs = false);
    }
  }

  Future<void> _addPhoto() async {
    final x = await _picker.pickImage(
        source: ImageSource.camera, maxWidth: 1600, imageQuality: 85);
    if (x == null) return;
    final ext = x.name.contains('.')
        ? x.name.split('.').last.toLowerCase()
        : 'jpg';
    try {
      await context.read<DocumentProvider>().upload({
        'document_name': x.name,
        'document_type': 'Photo',
        'file_path': '/uploads/${_claim.id}/${x.name}',
        'file_format': ext,
        'claim_id': _claim.id,
      });
      await _loadDocs();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Document added')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Future<void> _submit() async {
    if (_statusPick.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Select a status')),
      );
      return;
    }
    final user = context.read<AuthProvider>().user!;
    setState(() => _submitting = true);
    try {
      final updated = await context.read<ClaimProvider>().verifyClaim(
            _claim.id,
            user.id,
            _statusPick,
          );
      setState(() => _claim = updated);
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Claim ${_claim.claimNumber} updated')),
        );
      }
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
    final user = context.watch<AuthProvider>().user!;
    final h = MediaQuery.of(context).size.height * 0.88;
    return SizedBox(
      height: h,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: ListView(
          children: [
            Text('Review: ${_claim.claimNumber}',
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            if (_claim.claimant != null) ...[
              Text('Claimant: ${_claim.claimant!.fullName}'),
              Text(_claim.claimant!.email),
              const SizedBox(height: 8),
            ],
            Row(
              children: [
                const Text('Status: '),
                StatusBadge(status: _claim.claimStatus),
              ],
            ),
            Text('Amount: ${formatInr(_claim.estimatedLossAmount)}'),
            if (_claim.loss != null) ...[
              const SizedBox(height: 8),
              Text('Loss: ${_claim.loss!.lossType}'),
              Text(_claim.loss!.lossLocation,
                  style: TextStyle(color: Colors.grey.shade700)),
            ],
            const Divider(),
            const Text('Documents',
                style: TextStyle(fontWeight: FontWeight.w600)),
            if (_loadingDocs)
              const Padding(
                padding: EdgeInsets.all(16),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (_docs.isEmpty)
              const Text('No documents attached.')
            else
              ..._docs.map((d) => ListTile(
                    dense: true,
                    title: Text(d.documentName),
                    subtitle: Text('${d.documentType} · ${d.fileFormat}'),
                  )),
            TextButton.icon(
              onPressed: _addPhoto,
              icon: const Icon(Icons.camera_alt_outlined),
              label: const Text('Add photo from camera'),
            ),
            const Divider(),
            Text('Assessing as ${user.firstName} ${user.lastName}',
                style: const TextStyle(fontWeight: FontWeight.w500)),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _statusPick.isEmpty ? null : _statusPick,
              decoration: const InputDecoration(labelText: 'Update status'),
              items: ClaimStatuses.surveyorOptions
                  .map((s) => DropdownMenuItem(
                        value: s,
                        child: Text(claimStatusLabel(s)),
                      ))
                  .toList(),
              onChanged: (v) => setState(() => _statusPick = v ?? ''),
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: _submitting ? null : _submit,
              child: _submitting
                  ? const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('Submit assessment'),
            ),
          ],
        ),
      ),
    );
  }
}
